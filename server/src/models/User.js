import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: 2,
    maxlength: 100
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email']
  },
  password: {
    type: String,
    minlength: 6,
    select: false
  },
  avatar: {
    type: String,
    default: null
  },
  googleId: String,
  role: {
    type: String,
    enum: ['user', 'admin', 'premium'],
    default: 'user'
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  refreshToken: String,
  // Premium subscription
  subscription: {
    plan: { type: String, enum: ['free', 'pro', 'enterprise'], default: 'free' },
    stripeCustomerId: String,
    stripeSubscriptionId: String,
    currentPeriodEnd: Date,
    status: { type: String, default: 'inactive' }
  },
  // Usage tracking
  usage: {
    resumesCreated: { type: Number, default: 0 },
    analysesRun: { type: Number, default: 0 },
    exportsCount: { type: Number, default: 0 },
    aiCallsThisMonth: { type: Number, default: 0 },
    lastResetDate: { type: Date, default: Date.now }
  },
  preferences: {
    theme: { type: String, enum: ['light', 'dark', 'system'], default: 'system' },
    emailNotifications: { type: Boolean, default: true },
    defaultTemplate: String
  },
  lastLogin: Date,
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Check if monthly limit should reset
userSchema.methods.checkAndResetMonthlyUsage = function () {
  const now = new Date();
  const lastReset = new Date(this.usage.lastResetDate);
  if (now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear()) {
    this.usage.aiCallsThisMonth = 0;
    this.usage.lastResetDate = now;
  }
};

const User = mongoose.model('User', userSchema);
export default User;
