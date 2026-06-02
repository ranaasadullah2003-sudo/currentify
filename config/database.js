const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

const connectDB = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ 1. LIVE DATABASE CONNECTED (ATLAS)');
};

const seedAdmin = async () => {
    try {
        const userExists = await User.findOne({ email: 'admin@currentify.com' });
        if (!userExists) {
            const hashedPassword = await bcrypt.hash('RanaAsadullah12345', 10);
            await User.create({
                email: 'admin@currentify.com',
                password: hashedPassword
            });
            console.log('✅ Admin account created correctly!');
        }
    } catch (err) {
        console.log('Error creating admin:', err);
    }
};

module.exports = { connectDB, seedAdmin };