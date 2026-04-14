import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import { setupSocketIO } from './config/socket.js';
import authRoutes from './routes/auth.js';
import resumeRoutes from './routes/resume.js';
import analyzerRoutes from './routes/analyzer.js';
import userRoutes from './routes/user.js';
import adminRoutes from './routes/admin.js';
import templateRoutes from './routes/template.js';
import { errorHandler } from './middleware/errorHandler.js';
import { rateLimiter } from './middleware/rateLimiter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:5174', process.env.CLIENT_URL],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Connect to MongoDB
connectDB();

// Setup Socket.IO
setupSocketIO(io);

// Security Middleware
/* 
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: false,
  crossOriginOpenerPolicy: false 
}));
*/

// Explicit COOP header for all responses
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'unsafe-none');
  next();
});

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', process.env.CLIENT_URL],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate Limiting
app.use('/api/', rateLimiter);

// Health Check (Handles /api/health or /health)
const healthCheck = (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString(), version: '1.0.0', url: req.url });
};
app.get('/api/health', healthCheck);
app.get('/health', healthCheck);

// API Routes
// We mount them both on /api and root to handle any Vercel routing variations
const mountRoutes = (router) => {
  router.use('/auth', authRoutes);
  router.use('/resumes', resumeRoutes);
  router.use('/analyzer', analyzerRoutes);
  router.use('/users', userRoutes);
  router.use('/admin', adminRoutes);
  router.use('/templates', templateRoutes);
};

// Mount for locally and standard Vercel calls
const apiRouter = express.Router();
mountRoutes(apiRouter);
app.use('/api', apiRouter);

// Fallback mount if /api is stripped by Vercel
mountRoutes(app);

// Error Handler
app.use(errorHandler);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

export default app;
