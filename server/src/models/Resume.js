import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const experienceSchema = new mongoose.Schema({
  id: { type: String, default: () => uuidv4() },
  company: String,
  position: String,
  location: String,
  startDate: String,
  endDate: String,
  current: { type: Boolean, default: false },
  description: String,
  achievements: [String]
}, { _id: false });

const educationSchema = new mongoose.Schema({
  id: { type: String, default: () => uuidv4() },
  institution: String,
  degree: String,
  field: String,
  location: String,
  startDate: String,
  endDate: String,
  gpa: String,
  achievements: [String]
}, { _id: false });

const projectSchema = new mongoose.Schema({
  id: { type: String, default: () => uuidv4() },
  name: String,
  description: String,
  technologies: [String],
  link: String,
  github: String,
  startDate: String,
  endDate: String
}, { _id: false });

const certificationSchema = new mongoose.Schema({
  id: { type: String, default: () => uuidv4() },
  name: String,
  issuer: String,
  date: String,
  expiry: String,
  credentialId: String,
  link: String
}, { _id: false });

const skillSchema = new mongoose.Schema({
  category: String,
  items: [String],
  level: { type: String, enum: ['beginner', 'intermediate', 'advanced', 'expert'] }
}, { _id: false });

const resumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    default: 'Untitled Resume',
    maxlength: 200
  },
  templateId: {
    type: String,
    default: 'professional-1'
  },
  // Visibility
  isPublic: { type: Boolean, default: false },
  shareToken: { type: String, unique: true, sparse: true },
  // Personal Information
  personalInfo: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    location: String,
    website: String,
    linkedin: String,
    github: String,
    twitter: String,
    photo: String, // Cloudinary URL
    jobTitle: String,
    nationality: String
  },
  // Resume Sections
  summary: String,
  experience: [experienceSchema],
  education: [educationSchema],
  skills: [skillSchema],
  projects: [projectSchema],
  certifications: [certificationSchema],
  languages: [{
    id: { type: String, default: () => uuidv4() },
    name: String,
    proficiency: { type: String, enum: ['native', 'fluent', 'professional', 'conversational', 'basic'] }
  }],
  // Custom sections
  customSections: [{
    id: { type: String, default: () => uuidv4() },
    title: String,
    content: String,
    order: Number
  }],
  // Section ordering
  sectionOrder: {
    type: [String],
    default: ['summary', 'experience', 'education', 'skills', 'projects', 'certifications', 'languages']
  },
  // Styling
  theme: {
    primaryColor: { type: String, default: '#2563eb' },
    secondaryColor: { type: String, default: '#1e40af' },
    backgroundColor: { type: String, default: '#ffffff' },
    textColor: { type: String, default: '#111827' },
    fontFamily: { type: String, default: 'Inter' },
    fontSize: { type: String, default: 'medium' },
    spacing: { type: String, default: 'normal' }
  },
  // Analytics
  views: { type: Number, default: 0 },
  downloads: { type: Number, default: 0 },
  // Version history (last 10 versions)
  versions: [{
    snapshot: Object,
    createdAt: { type: Date, default: Date.now },
    note: String
  }],
  // AI Generated content flags
  aiGenerated: {
    summary: { type: Boolean, default: false },
    experiences: [String], // ids of AI-generated items
    skills: { type: Boolean, default: false }
  },
  lastEditedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Generate share token
resumeSchema.methods.generateShareToken = function () {
  this.shareToken = uuidv4();
  return this.shareToken;
};

// Auto-update lastEditedAt
resumeSchema.pre('save', function (next) {
  this.lastEditedAt = new Date();
  // Keep only 10 versions
  if (this.versions && this.versions.length > 10) {
    this.versions = this.versions.slice(-10);
  }
  next();
});

// Index for performance
resumeSchema.index({ user: 1, createdAt: -1 });

const Resume = mongoose.model('Resume', resumeSchema);
export default Resume;
