import multer from 'multer';

// TODO: Set up fileFilter to only accept pdf extname and mimetype

const uploadToMemory = multer();

export { uploadToMemory };
