/**
 * File upload middleware (Multer)
 * Handles multipart/form-data for crop image uploads.
 * Validates file type and enforces size limits.
 */
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { UPLOAD } from '../config/constants.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── Storage Config ───────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (_req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

// ── File Filter — Only allow images ──────────────────────────────
const fileFilter = (_req, file, cb) => {
  if (UPLOAD.ALLOWED_MIMETYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed: ${UPLOAD.ALLOWED_MIMETYPES.join(', ')}`), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: UPLOAD.MAX_FILE_SIZE },
});

export default upload;
