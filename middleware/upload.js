const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'news_posts',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'mp4', 'webm', 'ogg', 'mov', 'm4v'],
        resource_type: 'auto',
    },
});

const allowedMimeTypes = [
    'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
    'image/svg+xml', 'image/bmp', 'video/mp4', 'video/webm', 'video/ogg',
    'video/quicktime', 'video/x-m4v'
];

const fileFilter = (req, file, cb) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
        return cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', `${file.fieldname} must be a supported image or video type.`));
    }
    cb(null, true);
};

const upload = multer({ storage, fileFilter });
const uploadOptions = upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'video', maxCount: 1 }
]);

const handleUploadError = (err, req, res, next) => {
    if (!err) return next();
    let message;
    if (err instanceof multer.MulterError) {
        message = err.message || JSON.stringify(err);
    } else if (err && typeof err.message === 'string') {
        message = err.message;
    } else {
        message = JSON.stringify(err);
    }
    return res.status(400).send(`Upload error: ${message}`);
};

// Helper for references
const parseReferences = (body) => {
    try {
        const refNames = body.refName || [];
        const refUrls = body.refUrl || [];
        const refs = refNames.map((name, i) => ({
            name: name,
            url: refUrls[i] || ''
        })).filter(ref => ref.name && ref.name.trim() !== '');
        return JSON.stringify(refs);
    } catch (e) {
        return '[]';
    }
};

module.exports = { uploadOptions, handleUploadError, parseReferences };