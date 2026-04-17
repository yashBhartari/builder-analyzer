import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env from project root on Vercel
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

import app from '../server/src/index.js';

export default (req, res) => {
  // Vercel rewrites /api/* -> /api/index.js but the req.url becomes the full path
  // Ensure the Express app sees the correct path
  console.log('--- Vercel Function Hit ---');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  return app(req, res);
};
