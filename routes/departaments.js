const express = require('express');
const router = express.Router();
const auth = require('./auth');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


//Models
const Company = require('../models/company.js');
const Departament = require('../models/departament.js');

router.get('/', auth , function(req, res){
    res.render('departaments');
});

router.post('/add', auth, function(req, res){
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

        var newDepartament = new Departament({
            _id: new mongoose.Types.ObjectId(),
            name: departamentName
        });

        newDepartament.save(function(err) {
            if (err) return handleError(err);

            Company.update({_id: companyId}, {$push : {departaments : newDepartament._id }},
                 function(err) {
                    // Error handling
                    if(err){
                        req.flash('negative', err);
                    }
                    else{
                        req.flash('positive', 'New departament has been added successfully');
                        res.redirect('/departaments');
                    }
                })

        });
    }
});

module.exports = router;
