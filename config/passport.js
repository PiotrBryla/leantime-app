const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const config = require('../config/database');

module.exports = function(passport) {
    // LocalStrategy
    passport.use(new LocalStrategy(function(username, passport, done) {
        // Match Username
        let query = {username: username};
        User.findOne(query, function (err, user) {
            if(err) throw err;
            if(!user){
                return done(null, false, {message: "No user found"})
            }

            // Match Passport
            bcrypt.compare(passport, user.password, function(err, isMatched) {
                if(err)  throw err;
                if(isMatched){
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Wrong password or username.'})
                }
            });
        });
    }));

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
}
