import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { body, validationResult } from 'express-validator';
import Resume from '../models/Resume.js';
import User from '../models/User.js';
import { protect, optionalAuth } from '../middleware/auth.js';
import { uploadPhoto } from '../middleware/upload.js';
import { uploadPhotoToCloudinary } from '../utils/cloudinary.js';
import { generateAIContent } from '../utils/aiService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { aiLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// GET /api/resumes - Get all user's resumes
router.get('/', protect, asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, sort = '-updatedAt', search } = req.query;
  const query = { user: req.user._id };
  if (search) query.title = { $regex: search, $options: 'i' };

  const resumes = await Resume.find(query)
    .select('-versions -aiGenerated')
    .sort(sort)
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit));

  const total = await Resume.countDocuments(query);

  res.json({
    success: true,
    data: resumes,
    pagination: { total, page: Number(page), pages: Math.ceil(total / limit) }
  });
}));

// POST /api/resumes - Create new resume
router.post('/', protect, asyncHandler(async (req, res) => {
  const { title, templateId } = req.body;
  const user = req.user;

  // All users have unlimited resources

  const resume = await Resume.create({
    user: user._id,
    title: title || 'Untitled Resume',
    templateId: templateId || 'professional-1'
  });

  await User.findByIdAndUpdate(user._id, { $inc: { 'usage.resumesCreated': 1 } });

  res.status(201).json({ success: true, data: resume });
}));

// GET /api/resumes/:id - Get specific resume
router.get('/:id', protect, asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });
  if (!resume) {
    return res.status(404).json({ success: false, message: 'Resume not found' });
  }
  res.json({ success: true, data: resume });
}));

// PUT /api/resumes/:id - Update resume
router.put('/:id', protect, asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });
  if (!resume) {
    return res.status(404).json({ success: false, message: 'Resume not found' });
  }

  const allowedFields = [
    'title', 'templateId', 'personalInfo', 'summary', 'experience',
    'education', 'skills', 'projects', 'certifications', 'languages',
    'customSections', 'sectionOrder', 'theme', 'isPublic'
  ];

  // Create version snapshot before update
  if (req.body.createVersion) {
    resume.versions.push({
      snapshot: resume.toObject(),
      note: req.body.versionNote || 'Auto-save'
    });
  }

  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      resume[field] = req.body[field];
    }
  });

  await resume.save();
  res.json({ success: true, data: resume });
}));

// DELETE /api/resumes/:id
router.delete('/:id', protect, asyncHandler(async (req, res) => {
  const resume = await Resume.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!resume) {
    return res.status(404).json({ success: false, message: 'Resume not found' });
  }
  res.json({ success: true, message: 'Resume deleted successfully' });
}));

// POST /api/resumes/:id/duplicate
router.post('/:id/duplicate', protect, asyncHandler(async (req, res) => {
  const original = await Resume.findOne({ _id: req.params.id, user: req.user._id });
  if (!original) {
    return res.status(404).json({ success: false, message: 'Resume not found' });
  }

  const duplicated = original.toObject();
  delete duplicated._id;
  delete duplicated.createdAt;
  delete duplicated.updatedAt;
  delete duplicated.shareToken;
  duplicated.title = `${original.title} (Copy)`;
  duplicated.views = 0;
  duplicated.downloads = 0;
  duplicated.versions = [];

  const newResume = await Resume.create(duplicated);
  res.status(201).json({ success: true, data: newResume });
}));

// POST /api/resumes/:id/share - Generate share link
router.post('/:id/share', protect, asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });
  if (!resume) {
    return res.status(404).json({ success: false, message: 'Resume not found' });
  }

  if (!resume.shareToken) {
    resume.generateShareToken();
  }
  resume.isPublic = true;
  await resume.save({ validateBeforeSave: false });

  const shareUrl = `${process.env.CLIENT_URL}/r/${resume.shareToken}`;
  res.json({ success: true, shareUrl, shareToken: resume.shareToken });
}));

// GET /api/resumes/share/:token - Public resume view
router.get('/share/:token', optionalAuth, asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({ shareToken: req.params.token, isPublic: true })
    .select('-versions -user');

  if (!resume) {
    return res.status(404).json({ success: false, message: 'Resume not found or is private' });
  }

  // Increment view count
  await Resume.findByIdAndUpdate(resume._id, { $inc: { views: 1 } });

  res.json({ success: true, data: resume });
}));

// POST /api/resumes/:id/upload-photo - Upload profile photo
router.post('/:id/upload-photo', protect, uploadPhoto.single('photo'), asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });
  if (!resume) {
    return res.status(404).json({ success: false, message: 'Resume not found' });
  }

  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  try {
    const result = await uploadPhotoToCloudinary(req.file.buffer, req.user._id.toString());
    resume.personalInfo = { ...resume.personalInfo, photo: result.secure_url };
    await resume.save();
    res.json({ success: true, photoUrl: result.secure_url });
  } catch (error) {
    // If Cloudinary not configured, return a placeholder
    console.error('Cloudinary error:', error.message);
    res.json({ success: true, photoUrl: `https://ui-avatars.com/api/?name=${resume.personalInfo?.firstName || 'User'}&size=300&background=667eea&color=fff` });
  }
}));

// POST /api/resumes/ai-generate - AI content generation
router.post('/ai/generate', protect, aiLimiter, asyncHandler(async (req, res) => {
  const { type, context } = req.body;
  const user = req.user;

  user.checkAndResetMonthlyUsage();
  // Unlimited AI calls

  const content = await generateAIContent(type, context);
  await User.findByIdAndUpdate(user._id, { $inc: { 'usage.aiCallsThisMonth': 1 } });

  res.json({ success: true, content });
}));

// GET /api/resumes/:id/versions - Get version history
router.get('/:id/versions', protect, asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id }).select('versions title');
  if (!resume) {
    return res.status(404).json({ success: false, message: 'Resume not found' });
  }

  const versions = (resume.versions || []).map((v, i) => ({
    index: i,
    createdAt: v.createdAt,
    note: v.note
  }));

  res.json({ success: true, data: versions.reverse() });
}));

// POST /api/resumes/:id/restore/:versionIndex - Restore a version
router.post('/:id/restore/:versionIndex', protect, asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });
  if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });

  const version = resume.versions[Number(req.params.versionIndex)];
  if (!version) return res.status(404).json({ success: false, message: 'Version not found' });

  const snapshot = version.snapshot;
  const allowedFields = ['personalInfo', 'summary', 'experience', 'education', 'skills', 'projects', 'certifications', 'languages', 'theme', 'sectionOrder'];
  allowedFields.forEach(f => { if (snapshot[f] !== undefined) resume[f] = snapshot[f]; });

  await resume.save();
  res.json({ success: true, data: resume, message: 'Resume restored from version history' });
}));

export default router;
