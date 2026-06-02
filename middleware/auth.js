const protectRoute = (req, res, next) => {
    if (req.session.isAdmin) {
        return next();
    }
    res.redirect('/login');
};

module.exports = { protectRoute };