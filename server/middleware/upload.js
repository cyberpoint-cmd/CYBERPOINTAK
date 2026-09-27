import multer from 'multer';
import path from 'path';
import { SITE_CONFIG } from '../config/siteConfig.js';

// Use memory storage for direct buffer processing without writing unneeded files to disk
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp'
  ];

  const ext = path.extname(file.originalname).toLowerCase();
  const allowedExts = ['.pdf', '.jpg', '.jpeg', '.png', '.webp'];

  if (allowedTypes.includes(file.mimetype) || allowedExts.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type: ${file.originalname}. Only PDF and images are allowed.`), false);
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: SITE_CONFIG.MAX_FILE_SIZE,
    files: 20 // Allow up to 20 files for merge / images
  },
  fileFilter
});
