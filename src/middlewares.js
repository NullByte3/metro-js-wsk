import multer from 'multer';
import sharp from 'sharp';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import 'dotenv/config';

const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      const error = new Error('Only images and videos are allowed!');
      error.status = 400;
      cb(error, false);
    }
  },
});

const createThumbnail = async (req, res, next) => {
  if (!req.file) {
    next();
    return;
  }
  
  try {
    const thumbnailPath = `${req.file.path}_thumb`;
    await sharp(req.file.path)
      .resize(160, 160)
      .png()
      .toFile(thumbnailPath);
    next();
  } catch (error) {
    next(error);
  }
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    const error = new Error('Token required');
    error.status = 401;
    return next(error);
  }
  
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (error) {
    error.status = 403;
    error.message = 'Invalid token';
    next(error);
  }
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  const error = new Error('Admin privileges required');
  error.status = 403;
  next(error);
};

const validationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors
      .array()
      .map((error) => `${error.path}: ${error.msg}`)
      .join(', ');
    const error = new Error(messages);
    error.status = 400;
    return next(error);
  }
  next();
};

const notFoundHandler = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.status = 404;
  next(error);
};

const errorHandler = (err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message,
      status: err.status || 500
    }
  });
};

export { 
  upload, 
  createThumbnail, 
  authenticateToken, 
  isAdmin, 
  validationErrors, 
  notFoundHandler, 
  errorHandler 
};
