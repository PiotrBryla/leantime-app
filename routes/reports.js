const express = require('express');
const router = express.Router();
const auth = require('./auth');
const reportClient = require("jsreport-client")("http://localhost:5488", "admin", "password");

router.get('/', auth, function(req, res, next){
    res.render('reports');
});

router.get('/report', auth, function(req, res, next){
    reportClient.render({
        template: { content: "Hello World", recipe: "phantom-pdf", engine: "jsrender"}
    }, function(err, response) {
        if (err) {
            return next(err);
        }
        response.pipe(res);
    });
});


module.exports = router;
