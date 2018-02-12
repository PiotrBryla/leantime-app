const express = require('express');
const router = express.Router();

//Models
const Company = require('../models/company.js');

router.get('/' ,function(req, res){
    res.render('departaments');
});

router.post('/add' ,function(req, res){
    const departamentName = req.body.departamentName;
    const companyId = req.body.companyId;

    req.checkBody('departamentName', 'Departament name is required').notEmpty();
    req.checkBody('companyId', 'System error, please contact the support').notEmpty();

    let errors = req.validationErrors();

    if(errors) {
        res.render('/', {
            errors: errors
        });
    } else {
        Company.update({_id: companyId}, {$push : {departaments : {name: departamentName}}},
             function(err) {
                // Error handling
                if(err){
                    req.flash('negative', err);
                }
                else{
                    req.flash('positive', 'New departament added successfully');
                    res.redirect('/departaments');
                }
            })
    }

});


module.exports = router;
