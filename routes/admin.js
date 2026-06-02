const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Post = require('../models/Post');
const { protectRoute } = require('../middleware/auth');

// Login Page
router.get('/login', (req, res) => {
    res.render('login', { error: null });
});

// Login Logic
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && await bcrypt.compare(password, user.password)) {
        req.session.isAdmin = true;
        res.redirect('/');
    } else {
        res.render('login', { error: 'Invalid Credentials' });
    }
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

// Dashboard
router.get('/dashboard', protectRoute, async (req, res) => {
    try {
        const totalPosts = await Post.countDocuments();
        const recentPosts = await Post.find().sort({ createdAt: -1 }).limit(10);
        const topPosts = await Post.find().sort({ clicks: -1 }).limit(5);

        const totalClicks = await Post.aggregate([
            { $group: { _id: null, total: { $sum: "$clicks" } } }
        ]);
        const totalViews = await Post.aggregate([
            { $group: { _id: null, total: { $sum: "$views" } } }
        ]);
        const categories = await Post.aggregate([
            { $group: { _id: "$category", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        res.render('dashboard', {
            totalPosts,
            totalClicks: totalClicks[0]?.total || 0,
            totalViews: totalViews[0]?.total || 0,
            categories,
            recentPosts,
            topPosts
        });
    } catch (err) {
        console.error('Dashboard error:', err);
        res.status(500).send("Error loading dashboard");
    }
});

// API: Get all posts for dashboard
router.get('/api/all-posts', protectRoute, async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 }).select('title category clicks views createdAt');
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Contact Form
router.post('/contact', (req, res) => {
    res.send("<script>alert('Thank you! Your message has been sent.'); window.location.href='/contact';</script>");
});

module.exports = router;