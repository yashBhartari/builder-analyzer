import mongoose from 'mongoose';

const templateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  category: {
    type: String,
    enum: ['professional', 'creative', 'ats-friendly', 'academic', 'minimal', 'modern'],
    default: 'professional'
  },
  thumbnail: String, // Cloudinary URL
  isPremium: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  usageCount: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 },
  tags: [String],
  defaultTheme: {
    primaryColor: String,
    secondaryColor: String,
    fontFamily: String,
    fontSize: String,
    spacing: String
  },
  layoutConfig: Object, // Layout-specific configuration
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const Template = mongoose.model('Template', templateSchema);
export default Template;
