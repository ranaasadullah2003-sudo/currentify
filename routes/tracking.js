const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// Track click
router.post('/track/click/:id', async (req, res) => {
    try {
        await Post.findByIdAndUpdate(req.params.id, { $inc: { clicks: 1 } });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Track view
router.post('/track/view/:id', async (req, res) => {
    try {
        await Post.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;