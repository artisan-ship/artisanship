var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/users');
var Product = require('../models/products');
var Creator = require('../models/creators');
var UserInfo = require('../models/user_info');

router.get('/collections', function(req, res) {
    Creator.find({}, function(err, foundCreators) {
        if (err) {
            console.log('err');
        } else {
            res.render('collections/index', { creators: foundCreators });
        }
    });
});

router.get('/collections/:id/products', function(req, res) {
    // needs to be changed in the future

    Creator.findById(req.params.id)
        .populate('Products')
        .exec(function(err, foundCreator) {
            if (err) {
                console.log(err);
            } else {
                UserInfo.find({ 'user.id': req.user._id }, function(err, foundUser) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.render('collections/products/index', {
                            creator: foundCreator,
                            userInfo: foundUser
                        });
                    }
                });
            }
        });
});
router.get('/collections/:id/products/:product_id', function(req, res) {
    var productId = req.params.product_id;

    Product.findById(productId, function(err, foundProduct) {
        if (err) {
            console.log(err);
        } else {
            UserInfo.find({ 'user.id': req.user._id }, function(err, foundUser) {
                if (err) {
                    console.log(err);
                } else {
                    res.render('collections/products/show', {
                        product: foundProduct,
                        userInfo: foundUser
                    });
                }
            });
        }
    });
});



module.exports = router;