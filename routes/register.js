const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

// Import User Model
const User = require('../models/user.js');
const Company = require('../models/company.js');

// Diplay register page
router.get('/' ,function(req, res){
    res.render('register');
});

router.post('/', function(req,res) {
    const companyName = req.body.company;
    const companyEmail = req.body.companyemail;
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const password2 = req.body.password2;

    req.checkBody('company', 'Company name is required').notEmpty();
    req.checkBody('companyemail', 'Company email is required').notEmpty();
    req.checkBody('companyemail', 'Company email is not valid').isEmail();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('email', 'User email is required').notEmpty();
    req.checkBody('email', 'User email is not valid').isEmail();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Password confirmation does not match with given password').equals(password);

    let errors = req.validationErrors();

    if(errors) {
        res.render('register', {
            errors: errors
        });
    } else {

        let newCompany = new Company({
            name: companyName,
            email: companyEmail
        });

        let newUser = new User({
            email: email,
            password: password,
            username: username,
            role: 'ADMIN',
            companyId: newCompany._id
        });
        newCompany.save().then(function(){

            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(newUser.password, salt, function(err, hash) {
                    if(err){
                        console.log(err);
                    }
                    newUser.password = hash;
                    newUser.save(function(err) {
                        if(err){
                            console.log(err);
                            return;
                        } else {
                            req.flash('positive', 'Registeration complete, you can log in now.')
                            res.redirect('login');
                        }
                    });
                })
            });
        });
    }
});

module.exports = router;
