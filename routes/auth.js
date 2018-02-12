function isAuth(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    } else {
        req.flash('negative', 'Please login');
        res.redirect('/login');
    }
}

module.exports = isAuth;
