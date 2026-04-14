import mongoose from 'mongoose';

const analysisSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  resume: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
    default: null
  },
  // Input
  resumeText: String,
  jobDescription: String,
  jobTitle: String,
  resumeFileName: String,
  // Scores
  scores: {
    overall: { type: Number, min: 0, max: 100 },
    ats: { type: Number, min: 0, max: 100 },
    keywordMatch: { type: Number, min: 0, max: 100 },
    readability: { type: Number, min: 0, max: 100 },
    formatting: { type: Number, min: 0, max: 100 },
    quantifiableAchievements: { type: Number, min: 0, max: 100 },
    jobFit: { type: Number, min: 0, max: 100 }
  },
  // Detailed Analysis
  strengths: [String],
  weaknesses: [String],
  suggestions: [{
    category: String,
    priority: { type: String, enum: ['high', 'medium', 'low'] },
    text: String,
    example: String
  }],
  // Keyword Analysis
  keywords: {
    matched: [String],
    missing: [String],
    recommended: [String]
  },
  // Skills
  skillsAnalysis: {
    present: [String],
    missing: [String],
    recommended: [String]
  },
  // Section analysis
  sectionAnalysis: {
    hasContactInfo: Boolean,
    hasSummary: Boolean,
    hasExperience: Boolean,
    hasEducation: Boolean,
    hasSkills: Boolean,
    hasProjects: Boolean,
    hasCertifications: Boolean,
    missingSections: [String]
  },
  // AI raw response (for debugging)
  rawAIResponse: String,
  // Model used
  aiModel: { type: String, default: 'gpt-3.5-turbo' },
  // Processing time in ms
  processingTime: Number,
  // JD Comparison (array for multi-JD)
  jdComparisons: [{
    jobTitle: String,
    jobDescription: String,
    fitScore: Number,
    matchedKeywords: [String],
    missingKeywords: [String],
    createdAt: { type: Date, default: Date.now }
  }],
  // Rewrite suggestions
  rewrites: [{
    section: String,
    original: String,
    suggested: String
  }]
}, {
  timestamps: true
});

analysisSchema.index({ user: 1, createdAt: -1 });
analysisSchema.index({ resume: 1 });

const Analysis = mongoose.model('Analysis', analysisSchema);
export default Analysis;
