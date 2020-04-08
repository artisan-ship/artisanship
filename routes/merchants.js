var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/users');
var Product = require('../models/products');
var Creator = require('../models/creators');
var Merchant = require('../models/merchants');

router.get('/merchant', isLoggedIn, function(req, res) {
	var userId = req.user._id;
	Merchant.find({ 'creators.id': userId })
		.populate('Products')
		.exec(function(err, foundMerchant) {
			if (err) {
				console.log('err');
			} else {
				console.log(foundMerchant);

				res.render('merchant/index', { merchant: foundMerchant[0] });
			}
		});
});

//company routes --------------------------->
router.get('/merchant/company/new', isLoggedIn, function(req, res) {
	var userId = req.user._id;
	Merchant.find({ 'creators.id': userId }, function(err, foundCompany) {
		if (err) {
			console.log('err');
		} else {
			console.log(foundCompany.length);

			if (foundCompany.length > 0) {
				console.log('already created a company');
				res.redirect('/merchant');
			} else {
				res.render('merchant/company/new');
			}
		}
	});
});

router.get('/merchant/products', (req, res) => {
	var userId = req.user._id;
	Merchant.find({ 'creators.id': userId })
		.populate('products')
		.exec(function(err, foundMerchant) {
			if (err) {
				console.log(err);
				req.flash('error', 'There was a problem...');
				res.redirect('/merchant');
			} else {
				var products = foundMerchant[0].products;
				res.render('merchant/products/index', { merchant: foundMerchant[0] });
			}
		});
});

router.post('/merchant/company', isLoggedIn, function(req, res) {
	var company = req.body.company;
	var price = req.body.price;
	var tags = req.body.tags;
	var image = req.body.image;
	var body = req.body.body;
	var creator = {
		id: req.user._id,
		username: req.user.username
	};

	var newCompany = {
		company: company,
		price: price,
		tags: tags,
		image: image,
		body: body,
		creators: creator
	};

	var userId = req.user._id;
	Merchant.find({ 'creators.id': userId }, function(err, foundCompany) {
		if (err) {
			console.log('err');
		} else {
			console.log(foundCompany.length);

			if (foundCompany.length > 0) {
				console.log('You already created a company');
				res.redirect('/merchant');
			} else {
				Merchant.create(newCompany, function(err, createdCompany) {
					if (err) {
						console.log(err);
					} else {
						console.log(newCompany);
						res.redirect('/merchant');
					}
				});
			}
		}
	});
});

router.get('/merchant/search', (req, res) => {
	var userId = req.user._id;
	Merchant.find({ 'creators.id': userId })
		.populate('products')
		.exec(function(err, foundMerchant) {
			if (err) {
				console.log(err);
				req.flash('error', 'There was a problem...');
				res.redirect('/merchant');
			} else {
				Product.find({}, function(err, foundProducts) {
					if (err) {
						console.log(err);
					} else {
						var products = foundMerchant[0].products;
						res.render('merchant/search/index', {
							products: foundProducts,
							merchantProducts: products
						});
					}
				});
			}
		});
});

router.delete('/merchants/products/:id', function(req, res) {
	Product.findByIdAndRemove(req.params.id, function(err) {
		if (err) {
			console.log('err');
		} else {
			res.redirect('/merchants/products');
		}
	});
});

router.get('merchant/export', (req, res) => {
	var userId = req.user._id;
	Merchant.find({ 'creators.id': userId })
		.populate('export')
		.exec(function(err, foundMerchant) {
			if (err) {
				console.log(err);
				req.flash('error', 'There was a problem...');
				res.redirect('/merchant');
			} else {
				console.log(foundimports);
				var products = foundMerchant[0].export;
				res.render('merchant/export/index', { products: products });
			}
		});
});

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}

	res.redirect('/login');
}

module.exports = router;