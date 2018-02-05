const express = require('express');
const router = express.Router();

// Logout function
router.get('/' ,function(req, res){
    req.logout();
    req.flash('positive', 'You have been logged out successfully.');
    res.redirect('/');
});

module.exports = router;
