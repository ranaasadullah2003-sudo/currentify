require('dotenv').config();
const mongoose = require('mongoose');
const Post = require('./models/Post');

mongoose.connect(process.env.MONGO_URI).then(async () => {
    
    const cats = await Post.distinct('category');
    console.log('Distinct categories:', cats);
    
    const agg = await Post.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
    ]);
    console.log('Aggregation result:', JSON.stringify(agg, null, 2));
    
    const posts = await Post.find({}, 'title category').sort({ createdAt: -1 });
    console.log('All posts categories:');
    posts.forEach(p => console.log(' -', p.category, '|', p.title.substring(0, 40)));
    
    process.exit();
}).catch(err => { console.error(err); process.exit(); });