import express from 'express';
import User from '../models/User.js';
import Resume from '../models/Resume.js';
import Analysis from '../models/Analysis.js';
import Template from '../models/Template.js';
import { protect, requireAdmin } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// All admin routes require authentication + admin role
router.use(protect, requireAdmin);

// GET /api/admin/stats - Platform overview
router.get('/stats', asyncHandler(async (req, res) => {
  const [totalUsers, totalResumes, totalAnalyses, newUsersThisMonth, premiumUsers] = await Promise.all([
    User.countDocuments(),
    Resume.countDocuments(),
    Analysis.countDocuments(),
    User.countDocuments({ createdAt: { $gte: new Date(new Date().setDate(1)) } }),
    User.countDocuments({ role: { $in: ['premium', 'admin'] } })
  ]);

  const recentUsers = await User.find().sort('-createdAt').limit(10)
    .select('name email role createdAt lastLogin isEmailVerified subscription');

  res.json({
    success: true,
    data: {
      totalUsers,
      totalResumes,
      totalAnalyses,
      newUsersThisMonth,
      premiumUsers,
      recentUsers
    }
  });
}));

// GET /api/admin/users - All users with pagination
router.get('/users', asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search, role } = req.query;
  const query = {};
  if (search) query.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];
  if (role) query.role = role;

  const users = await User.find(query)
    .select('-password -refreshToken -passwordResetToken')
    .sort('-createdAt')
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit));

  const total = await User.countDocuments(query);

  res.json({
    success: true,
    data: users,
    pagination: { total, page: Number(page), pages: Math.ceil(total / limit) }
  });
}));

// PUT /api/admin/users/:id - Update user role/status
router.put('/users/:id', asyncHandler(async (req, res) => {
  const { role, isActive } = req.body;
  const updates = {};
  if (role) updates.role = role;
  if (isActive !== undefined) updates.isActive = isActive;

  const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true })
    .select('-password -refreshToken');

  if (!user) return res.status(404).json({ success: false, message: 'User not found' });

  res.json({ success: true, data: user });
}));

// DELETE /api/admin/users/:id
router.delete('/users/:id', asyncHandler(async (req, res) => {
  if (req.params.id === req.user._id.toString()) {
    return res.status(400).json({ success: false, message: 'Cannot delete your own account' });
  }

  await Promise.all([
    User.findByIdAndDelete(req.params.id),
    Resume.deleteMany({ user: req.params.id }),
    Analysis.deleteMany({ user: req.params.id })
  ]);

  res.json({ success: true, message: 'User and all associated data deleted' });
}));

// GET /api/admin/resumes - All resumes
router.get('/resumes', asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;

  const resumes = await Resume.find()
    .select('title user views downloads createdAt templateId isPublic')
    .populate('user', 'name email')
    .sort('-createdAt')
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit));

  const total = await Resume.countDocuments();

  res.json({
    success: true,
    data: resumes,
    pagination: { total, page: Number(page), pages: Math.ceil(total / limit) }
  });
}));

// POST /api/admin/templates - Create template
router.post('/templates', asyncHandler(async (req, res) => {
  const template = await Template.create({ ...req.body, createdBy: req.user._id });
  res.status(201).json({ success: true, data: template });
}));

// PUT /api/admin/templates/:id
router.put('/templates/:id', asyncHandler(async (req, res) => {
  const template = await Template.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!template) return res.status(404).json({ success: false, message: 'Template not found' });
  res.json({ success: true, data: template });
}));

export default router;
