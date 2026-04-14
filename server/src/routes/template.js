import express from 'express';
import Template from '../models/Template.js';
import { optionalAuth } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// Seed default templates if none exist
const DEFAULT_TEMPLATES = [
  { name: 'Professional Classic', description: 'Clean, traditional layout perfect for corporate roles', category: 'professional', tags: ['corporate', 'traditional'], defaultTheme: { primaryColor: '#2563eb', fontFamily: 'Inter', spacing: 'normal' } },
  { name: 'Modern Minimalist', description: 'Sleek and minimal design that stands out', category: 'modern', tags: ['minimal', 'clean'], defaultTheme: { primaryColor: '#0f172a', fontFamily: 'Roboto', spacing: 'compact' } },
  { name: 'Creative Portfolio', description: 'Bold design for creative professionals', category: 'creative', tags: ['design', 'artistic'], isPremium: true, defaultTheme: { primaryColor: '#7c3aed', fontFamily: 'Outfit', spacing: 'relaxed' } },
  { name: 'ATS Optimizer', description: 'Maximized for applicant tracking systems', category: 'ats-friendly', tags: ['ats', 'tech', 'software'], defaultTheme: { primaryColor: '#059669', fontFamily: 'Inter', spacing: 'normal' } },
  { name: 'Executive Pro', description: 'Premium design for senior professionals', category: 'professional', isPremium: true, tags: ['executive', 'leadership'], defaultTheme: { primaryColor: '#1e3a5f', fontFamily: 'Merriweather', spacing: 'relaxed' } },
  { name: 'Tech Developer', description: 'Developer-focused with GitHub-style elements', category: 'modern', tags: ['tech', 'developer', 'software'], defaultTheme: { primaryColor: '#0ea5e9', fontFamily: 'JetBrains Mono', spacing: 'compact' } },
  { name: 'Academic Research', description: 'Formal template for academic and research roles', category: 'academic', tags: ['academic', 'research', 'professor'], defaultTheme: { primaryColor: '#92400e', fontFamily: 'Georgia', spacing: 'normal' } },
  { name: 'Fresh Graduate', description: 'Perfect for entry-level candidates', category: 'minimal', tags: ['entry-level', 'graduate', 'student'], defaultTheme: { primaryColor: '#06b6d4', fontFamily: 'Nunito', spacing: 'normal' } },
  { name: 'Startup Hustler', description: 'Dynamic template for startup culture', category: 'modern', tags: ['startup', 'product', 'agile'], defaultTheme: { primaryColor: '#f59e0b', fontFamily: 'Inter', spacing: 'compact' } },
  { name: 'Healthcare Professional', description: 'Clean template for medical professionals', category: 'professional', tags: ['healthcare', 'medical', 'nursing'], defaultTheme: { primaryColor: '#10b981', fontFamily: 'Open Sans', spacing: 'normal' } }
];

const seedTemplates = async () => {
  const count = await Template.countDocuments();
  if (count === 0) {
    await Template.insertMany(DEFAULT_TEMPLATES);
    console.log('✅ Seeded 10 default templates');
  }
};

// Auto-seed on first request
let seeded = false;
router.use(async (req, res, next) => {
  if (!seeded) { await seedTemplates(); seeded = true; }
  next();
});

// GET /api/templates - List all templates
router.get('/', optionalAuth, asyncHandler(async (req, res) => {
  const { category, isPremium } = req.query;
  const query = { isActive: true };
  if (category) query.category = category;
  if (isPremium !== undefined) query.isPremium = isPremium === 'true';

  const templates = await Template.find(query).sort('-usageCount');
  res.json({ success: true, data: templates });
}));

// GET /api/templates/:id
router.get('/:id', asyncHandler(async (req, res) => {
  const template = await Template.findById(req.params.id);
  if (!template) return res.status(404).json({ success: false, message: 'Template not found' });
  res.json({ success: true, data: template });
}));

export default router;
