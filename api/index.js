import app from '../server/src/index.js';

export default (req, res) => {
  console.log('--- Vercel Function Hit ---');
  console.log('Method:', req.method);
  console.log('Path:', req.url);
  return app(req, res);
};
