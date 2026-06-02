const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const cloudinary = require('../config/cloudinary');
const { protectRoute } = require('../middleware/auth');
const { uploadOptions, parseReferences } = require('../middleware/upload');

// GET Add Page
router.get('/add', protectRoute, (req, res) => {
    res.render('add');
});

// POST Add Post
router.post('/add', protectRoute, uploadOptions, async (req, res) => {
    try {
        let imageUrl = null, videoUrl = null, imagePublicId = null, videoPublicId = null;

        if (req.files && req.files['image'] && req.files['image'][0]) {
            imageUrl = req.files['image'][0].path;
            imagePublicId = req.files['image'][0].filename;
        }
        if (req.files && req.files['video'] && req.files['video'][0]) {
            videoUrl = req.files['video'][0].path;
            videoPublicId = req.files['video'][0].filename;
        }

        const newPost = new Post({
            title: req.body.title,
            content: req.body.content,
            category: req.body.category,
            subCategory: req.body.subCategory,
            references: parseReferences(req.body),
            image: imageUrl,
            video: videoUrl,
            imagePublicId: imagePublicId,
            videoPublicId: videoPublicId
        });

        await newPost.save();
        console.log('💾 Post saved successfully!');
        res.redirect('/');
    } catch (err) {
        console.error('❌ Error saving post:', err.message);
        res.status(500).send("Error saving article: " + err.message);
    }
});

// GET Edit Page
router.get('/edit/:id', protectRoute, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.redirect('/');
        res.render('edit', { post });
    } catch (err) {
        console.error(err);
        res.redirect('/');
    }
});

// POST Edit Post
router.post('/edit/:id', protectRoute, uploadOptions, async (req, res) => {
    try {
        const existingPost = await Post.findById(req.params.id);
        if (!existingPost) return res.status(404).send('Post not found.');

        let imageUrl = existingPost.image, imagePublicId = existingPost.imagePublicId;
        let videoUrl = existingPost.video, videoPublicId = existingPost.videoPublicId;

        if (req.files && req.files['image']) {
            if (existingPost.imagePublicId) await cloudinary.uploader.destroy(existingPost.imagePublicId);
            imageUrl = req.files['image'][0].path;
            imagePublicId = req.files['image'][0].filename;
        }
        if (req.files && req.files['video']) {
            if (existingPost.videoPublicId) await cloudinary.uploader.destroy(existingPost.videoPublicId, { resource_type: 'video' });
            videoUrl = req.files['video'][0].path;
            videoPublicId = req.files['video'][0].filename;
        }

        await Post.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            content: req.body.content,
            category: req.body.category,
            subCategory: req.body.subCategory,
            references: parseReferences(req.body),
            image: imageUrl,
            video: videoUrl,
            imagePublicId: imagePublicId,
            videoPublicId: videoPublicId
        });

        console.log('✅ Post Updated Successfully');
        res.redirect('/');
    } catch (err) {
        console.error('❌ Error updating post:', err.message);
        res.status(500).send('Error updating post: ' + err.message);
    }
});

// DELETE Post
router.post('/delete/:id', protectRoute, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.redirect('/');

        if (post.imagePublicId) await cloudinary.uploader.destroy(post.imagePublicId);
        if (post.videoPublicId) await cloudinary.uploader.destroy(post.videoPublicId, { resource_type: 'video' });

        await Post.findByIdAndDelete(req.params.id);
        console.log('✅ Post removed from Database');
        res.redirect('/');
    } catch (err) {
        console.error('❌ Error during deletion:', err.message);
        res.status(500).send("Error deleting post: " + err.message);
    }
});

module.exports = router;