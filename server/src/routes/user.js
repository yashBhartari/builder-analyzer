import express from 'express';
import User from '../models/User.js';
import Resume from '../models/Resume.js';
import Analysis from '../models/Analysis.js';
import { protect } from '../middleware/auth.js';
import { uploadPhoto } from '../middleware/upload.js';
import { uploadPhotoToCloudinary } from '../utils/cloudinary.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// GET /api/users/dashboard - Dashboard stats
router.get('/dashboard', protect, asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const [resumeCount, analysisCount, resumes, analyses] = await Promise.all([
    Resume.countDocuments({ user: userId }),
    Analysis.countDocuments({ user: userId }),
    Resume.find({ user: userId }).select('title views downloads updatedAt templateId').sort('-updatedAt').limit(5),
    Analysis.find({ user: userId }).select('scores jobTitle createdAt resumeFileName').sort('-createdAt').limit(5)
  ]);

  const totalViews = resumes.reduce((sum, r) => sum + (r.views || 0), 0);
  const totalDownloads = resumes.reduce((sum, r) => sum + (r.downloads || 0), 0);

  res.json({
    success: true,
    data: {
      stats: {
        resumeCount,
        analysisCount,
        totalViews,
        totalDownloads,
        aiCallsThisMonth: req.user.usage?.aiCallsThisMonth || 0,
        aiCallsLimit: -1
      },
      recentResumes: resumes,
      recentAnalyses: analyses,
      user: {
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        subscription: req.user.subscription,
        usage: req.user.usage
      }
    }
  });
}));

// PUT /api/users/profile - Update profile
router.put('/profile', protect, asyncHandler(async (req, res) => {
  const allowedFields = ['name', 'preferences'];
  const updates = {};
  allowedFields.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

  const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true })
    .select('-password -refreshToken -passwordResetToken');

  res.json({ success: true, data: user });
}));

// POST /api/users/avatar - Update avatar
router.post('/avatar', protect, uploadPhoto.single('avatar'), asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  try {
    const result = await uploadPhotoToCloudinary(req.file.buffer, req.user._id.toString());
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: result.secure_url },
      { new: true }
    ).select('-password');
    res.json({ success: true, avatar: result.secure_url, user });
  } catch (error) {
    const initials = req.user.name.split(' ').map(n => n[0]).join('');
    const avatarUrl = `https://ui-avatars.com/api/?name=${req.user.name}&background=667eea&color=fff&size=200`;
    const user = await User.findByIdAndUpdate(req.user._id, { avatar: avatarUrl }, { new: true }).select('-password');
    res.json({ success: true, avatar: avatarUrl, user });
  }
}));

// PUT /api/users/change-password
router.put('/change-password', protect, asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select('+password');

  if (!user.password) {
    return res.status(400).json({ success: false, message: 'No password set (Google account). Use Google to sign in.' });
  }

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    return res.status(400).json({ success: false, message: 'Current password is incorrect' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
  }

  user.password = newPassword;
  await user.save();

  res.json({ success: true, message: 'Password changed successfully' });
}));

// DELETE /api/users/account - Delete account
router.delete('/account', protect, asyncHandler(async (req, res) => {
  const userId = req.user._id;
  await Promise.all([
    Resume.deleteMany({ user: userId }),
    Analysis.deleteMany({ user: userId }),
    User.findByIdAndDelete(userId)
  ]);
  res.json({ success: true, message: 'Account deleted successfully' });
}));

export default router;
