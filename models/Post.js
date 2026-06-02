const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    content: { type: String, required: true },
    references: { type: String, default: '[]' },
    image: { type: String, default: null },
    video: { type: String, default: null },
    imagePublicId: { type: String, default: null },
    videoPublicId: { type: String, default: null },
    clicks: { type: Number, default: 0 },
    views: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);