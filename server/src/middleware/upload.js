import multer from 'multer';
import path from 'path';

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
  'image/jpeg',
  'image/png',
  'image/webp'
];

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} not allowed. Supported: PDF, DOCX, DOC, JPEG, PNG`), false);
  }
};

// Memory storage (for processing before uploading to Cloudinary)
const memStorage = multer.memoryStorage();

export const uploadResume = multer({
  storage: memStorage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

export const uploadPhoto = multer({
  storage: memStorage,
  fileFilter: (req, file, cb) => {
    if (['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Please upload a valid image (JPEG, PNG, WebP)'), false);
    }
  },
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB
});
