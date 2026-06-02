const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// ═══ API ROUTE — must be first to avoid conflict with /category/:name ═══
router.get('/api/posts/:page', async (req, res) => {
    const page = parseInt(req.params.page) || 1;
    const perPage = 20;
    const skip = 10 + (page - 1) * perPage;
    
    try {
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(perPage)
            .select('title content category subCategory image video createdAt references');
        
        const total = await Post.countDocuments();
        const hasMore = skip + perPage < total;
        
        res.json({ posts, hasMore });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Homepage
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.render('index', { posts });
    } catch (err) {
        res.send("Error loading posts: " + err);
    }
});

// Search
router.get('/search', async (req, res) => {
    const query = req.query.query;
    try {
        const posts = await Post.find({
            title: { $regex: query, $options: 'i' }
        }).sort({ createdAt: -1 });
        res.render('index', { posts });
    } catch (err) {
        res.status(500).send("Search Error");
    }
});

// Static Pages
router.get('/about', (req, res) => { res.render('about'); });
router.get('/contact', (req, res) => { res.render('contact'); });
router.get('/privacy-policy', (req, res) => { res.render('privacy'); });
router.get('/terms', (req, res) => { res.render('terms'); });

// Category Filtering
router.get('/category/:name', async (req, res) => {
    try {
        const posts = await Post.find({ category: req.params.name }).sort({ createdAt: -1 });
        res.render('index', { posts });
    } catch (err) {
        res.status(500).send("Error loading category");
    }
});

// Subcategory Filtering
router.get('/subcategory/:name', async (req, res) => {
    try {
        const posts = await Post.find({ subCategory: req.params.name }).sort({ createdAt: -1 });
        res.render('index', { posts });
    } catch (err) {
        res.status(500).send("Error loading subcategory");
    }
});

module.exports = router;