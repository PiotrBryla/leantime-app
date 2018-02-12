const express = require('express');
const router = express.Router();
const auth = require('./auth');

router.get('/', auth, function(req, res){
    res.render('settings');
});

module.exports = router;
