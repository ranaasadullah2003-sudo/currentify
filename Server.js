const express = require('express');
const session = require('express-session');
require('dotenv').config();

const { connectDB, seedAdmin } = require('./config/database');
const { handleUploadError } = require('./middleware/upload');

const homeRoutes = require('./routes/home');
const postRoutes = require('./routes/posts');
const adminRoutes = require('./routes/admin');
const trackingRoutes = require('./routes/tracking');

const app = express();
const PORT = process.env.PORT || 3000;

// Global Middleware
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(session({
    secret: 'your_secret_key_here',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 }
}));

app.use((req, res, next) => {
    res.locals.isAdmin = req.session.isAdmin || false;
    next();
});

// Upload Error Handler
app.use(handleUploadError);

// Routes
app.use('/', homeRoutes);
app.use('/', postRoutes);
app.use('/', adminRoutes);
app.use('/', trackingRoutes);

// Start
connectDB()
    .then(() => {
        seedAdmin();
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 2. SERVER LIVE AT http://127.0.0.1:${PORT}`);
        });
    })
    .catch(err => console.error('❌ DB ERROR:', err));
