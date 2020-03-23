var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/users');
var Product = require('../models/products');
var Creator = require('../models/creators');
var Merchant   = require("../models/merchants");

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
           
                res.render('collections/products/index', { creator: foundCreator });
            }
        });
});



router.get('/collections/:id/products/:product_id', function(req, res) {
    var productId = req.params.product_id;
    Product.findById(productId, function(err, foundProduct){
		 if (err) {
                console.log(err);
            } else {
           console.log(foundProduct);
                res.render('collections/products/show', { product: foundProduct });
            }
	}
    )
});

router.post('/collections/:id/products', function(req, res) {
 
    var merchantId = req.user._id;
    var productId = req.body.id;
		console.log(productId);

    Product.findById(productId,function(err, foundProduct) {
            if (err) {
                console.log(err);
            } else {
				console.log(productId)
				console.log(foundProduct)
				Merchant.find({ 'creators.id': merchantId }, function(err, foundMerchant) {
				if (err) {
					console.log(merchantId);
				} else {
								console.log("passed")
				console.log(foundMerchant)
				Product.create(foundProduct, function(err, newlyCreated) {
				if (err) {
				console.log(err);
				} else {
					console.log(foundMerchant);
				foundMerchant[0].Products.push(newlyCreated);
				foundMerchant[0].save();

				console.log('Added a new product');
				console.log(foundMerchant);
				res.redirect('/admin');
				}
				});
				}
				});
			
			}
	});
});
	


module.exports = router;