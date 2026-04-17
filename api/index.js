import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env from project root (won't exist on Vercel, but needed locally)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });
dotenv.config({ path: path.resolve(__dirname, '..', 'server', '.env') });

import app from '../server/src/index.js';

export default (req, res) => {
  console.log('--- Vercel Function Hit ---');
  console.log('Method:', req.method, 'URL:', req.url);
  return app(req, res);
};
