import express from 'express';
import pdfParse from 'pdf-parse/lib/pdf-parse.js';
import mammoth from 'mammoth';
import Analysis from '../models/Analysis.js';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import { uploadResume } from '../middleware/upload.js';
import { analyzeResumeWithAI } from '../utils/aiService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { aiLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Extract text from file buffer
const extractTextFromFile = async (buffer, mimetype) => {
  if (mimetype === 'application/pdf') {
    const data = await pdfParse(buffer);
    return data.text;
  } else if (
    mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    mimetype === 'application/msword'
  ) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }
  throw new Error('Unsupported file type');
};

// POST /api/analyzer/analyze - Main analysis endpoint
router.post('/analyze', protect, aiLimiter, uploadResume.single('resume'), asyncHandler(async (req, res) => {
  const { jobDescription, jobTitle, resumeId, resumeText: pastedText } = req.body;
  const user = req.user;

  // Check AI usage limit
  user.checkAndResetMonthlyUsage();
  // All users have unlimited analysis access

  let resumeText = pastedText;
  let resumeFileName = null;

  // Extract text from uploaded file
  if (req.file) {
    resumeText = await extractTextFromFile(req.file.buffer, req.file.mimetype);
    resumeFileName = req.file.originalname;
  }

  if (!resumeText || resumeText.trim().length < 50) {
    return res.status(400).json({
      success: false,
      message: 'Resume content is too short or empty. Please upload a valid resume.'
    });
  }

  // Run AI analysis
  const analysisResult = await analyzeResumeWithAI(resumeText, jobDescription, jobTitle);

  // Save analysis to DB
  const analysis = await Analysis.create({
    user: user._id,
    resume: resumeId || null,
    resumeText: resumeText.substring(0, 5000), // Store first 5000 chars
    jobDescription: jobDescription?.substring(0, 3000),
    jobTitle,
    resumeFileName,
    scores: analysisResult.scores,
    strengths: analysisResult.strengths,
    weaknesses: analysisResult.weaknesses,
    suggestions: analysisResult.suggestions,
    keywords: analysisResult.keywords,
    skillsAnalysis: analysisResult.skillsAnalysis,
    sectionAnalysis: analysisResult.sectionAnalysis,
    rewrites: analysisResult.rewrites,
    aiModel: analysisResult.aiModel,
    processingTime: analysisResult.processingTime
  });

  // Update usage
  await User.findByIdAndUpdate(user._id, {
    $inc: { 'usage.analysesRun': 1, 'usage.aiCallsThisMonth': 1 }
  });

  res.json({
    success: true,
    data: analysis,
    message: 'Analysis completed successfully'
  });
}));

// GET /api/analyzer/analyses - Get all user's analyses
router.get('/analyses', protect, asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const analyses = await Analysis.find({ user: req.user._id })
    .select('-resumeText -rawAIResponse')
    .sort('-createdAt')
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit))
    .populate('resume', 'title templateId');

  const total = await Analysis.countDocuments({ user: req.user._id });

  res.json({
    success: true,
    data: analyses,
    pagination: { total, page: Number(page), pages: Math.ceil(total / limit) }
  });
}));

// GET /api/analyzer/analyses/:id - Get specific analysis
router.get('/analyses/:id', protect, asyncHandler(async (req, res) => {
  const analysis = await Analysis.findOne({
    _id: req.params.id,
    user: req.user._id
  }).populate('resume', 'title templateId personalInfo');

  if (!analysis) {
    return res.status(404).json({ success: false, message: 'Analysis not found' });
  }

  res.json({ success: true, data: analysis });
}));

// DELETE /api/analyzer/analyses/:id
router.delete('/analyses/:id', protect, asyncHandler(async (req, res) => {
  const analysis = await Analysis.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!analysis) {
    return res.status(404).json({ success: false, message: 'Analysis not found' });
  }
  res.json({ success: true, message: 'Analysis deleted' });
}));

// POST /api/analyzer/analyses/:id/compare-jd - Add JD comparison
router.post('/analyses/:id/compare-jd', protect, aiLimiter, asyncHandler(async (req, res) => {
  const { jobDescription, jobTitle } = req.body;
  const analysis = await Analysis.findOne({ _id: req.params.id, user: req.user._id });

  if (!analysis) return res.status(404).json({ success: false, message: 'Analysis not found' });
  if (!jobDescription) return res.status(400).json({ success: false, message: 'Job description required' });

  const result = await analyzeResumeWithAI(analysis.resumeText, jobDescription, jobTitle);

  analysis.jdComparisons.push({
    jobTitle,
    jobDescription: jobDescription.substring(0, 2000),
    fitScore: result.scores.jobFit,
    matchedKeywords: result.keywords.matched,
    missingKeywords: result.keywords.missing
  });

  await analysis.save();
  await User.findByIdAndUpdate(req.user._id, { $inc: { 'usage.aiCallsThisMonth': 1 } });

  res.json({ success: true, data: analysis.jdComparisons.slice(-1)[0] });
}));

// GET /api/analyzer/dashboard-stats - Analytics overview
router.get('/dashboard-stats', protect, asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const [analysisCount, latestAnalysis, avgScores] = await Promise.all([
    Analysis.countDocuments({ user: userId }),
    Analysis.findOne({ user: userId }).sort('-createdAt').select('scores createdAt jobTitle'),
    Analysis.aggregate([
      { $match: { user: userId } },
      { $group: {
        _id: null,
        avgOverall: { $avg: '$scores.overall' },
        avgAts: { $avg: '$scores.ats' },
        avgReadability: { $avg: '$scores.readability' },
        avgJobFit: { $avg: '$scores.jobFit' }
      }}
    ])
  ]);

  res.json({
    success: true,
    data: {
      totalAnalyses: analysisCount,
      latestAnalysis,
      averageScores: avgScores[0] || { avgOverall: 0, avgAts: 0, avgReadability: 0, avgJobFit: 0 }
    }
  });
}));

export default router;
