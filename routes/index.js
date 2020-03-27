var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/users');
var Product = require('../models/products');
var UserInfo = require('../models/user_info');
router.get('/', function(req, res) {
    Product.find({}, function(err, foundProduct) {
        if (err) {
            console.log('err');
        } else {
            res.render('home', { products: foundProduct });
        }
    });
});

router.get('/login', function(req, res) {
    res.render('login');
});

router.post(
    '/login',
    passport.authenticate('local', {
        successRedirect: '/admin',
        failureRedirect: '/login'
    }),
    function(req, res) {}
);

router.get('/register', function(req, res) {
    res.render('register');
});

router.post('/register', function(req, res) {
    User.register(new User({ username: req.body.username }), req.body.password, function(
        err,
        user
    ) {
        if (err) {
            console.log(err);
            return res.render('register');
        }
      
            UserInfo.create(req.body.register, function(err, newUser) {
                if (err) {
                    console.log('break down');
                } else {
                    res.redirect('/');
                }
            });
    
    });
});

router.get('/logout', function(req, res) {
    req.logout();

    res.redirect('/');
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/login');
}

module.exports = router;