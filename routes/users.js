var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var User = require('../models/users');
var Product = require('../models/products');
var UserInfo = require('../models/user_info');
var crypto = require('crypto');
const { route } = require('./admin');
const { nextTick } = require('process');
const middleware = require('../middleware/users');
router.get('/users', middleware.checkSecret, function (req, res) {
    if (err) {
        res.status(500);
        res.send(err);
    }
    User.find({}, function (err, foundUsers) {
        if (err) {
            console.log(err);
            res.send(err);
        }
        res.status(200);
        res.send(foundUsers);

    })

})


router.post('/users', function (req, res) {
    User.findById(req.query.id, function (err, foundUser) {
        if (foundUser.secret === req.query.secret && foundUser.type === 'super_user') {
            User.register(new User({ username: req.body.username }), req.body.password, function (
                err, user
            ) {
                if (err) {
                    console.log(err.message);
                }
                else {
                    user.type = req.body.type;
                    user.isVerified = false;
                    user.first_name = req.body.first_name;
                    user.last_name = req.body.last_name;
                    user.save();
                }

            })
        }
        else {
            res.status(400)
            res.send("bad request")
        }
    })
});


module.exports = router;