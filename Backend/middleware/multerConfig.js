// filepath: Backend/middleware/multerConfig.js
const multer = require('multer');
const path = require('path');

// Define allowed image formats
const allowedFileTypes = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Generate a unique filename with timestamp and cleaned original name
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const cleanFileName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '');
    cb(null, `${uniqueSuffix}-${cleanFileName}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (!allowedFileTypes.includes(file.mimetype)) {
    cb(new Error('Invalid file type. Only JPEG, PNG and WebP images are allowed.'), false);
    return;
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE
  }
});

module.exports = upload;