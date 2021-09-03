var express = require('express');
var router = express.Router();
var User = require('../models/users');
const middleware = require('../middleware/users');

router.get('/users', middleware.checkSecret, function (req, res) {
    User.find({}, function (err, foundUsers) {
        if (err) {
            console.log(err);
            res.status(500);
            res.send(err);
        }
        res.status(200);
        res.send(foundUsers);
    });a
});

router.post('/users', middleware.checkSecret, function (req, res) {
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
            res.status(200).send('created new user');
        }
    })
});

module.exports = router;