const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

// Import User Model
const User = require('../models/user.js');

// Diplay logn page
router.get('/' ,function(req, res){
    res.render('login');
});


module.exports = router;
