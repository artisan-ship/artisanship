var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/users');
var Product = require('../models/products');
var Creator = require('../models/creators');
var Merchant = require('../models/merchants');
var Collection = require('../models/collections');
var CollectionList = require('../models/collectionslist');
var collectionsId = '5e7dad0b38af5e0f7dfe1d82';

router.get('/admin', isLoggedIn, function(req, res) {
	var userId = req.user._id;

	Creator.find({ 'creators.id': userId }, function(err, foundCompany) {
		if (err) {
			console.log('err');
		} else {
			res.render('admin/index', { creator: foundCompany });
		}
	});
});

//company routes --------------------------->
router.get('/admin/company/new', isLoggedIn, function(req, res) {
	var userId = req.user._id;
	Creator.find({ 'creators.id': userId }, function(err, foundCompany) {
		if (err) {
			console.log('err');
		} else {
			console.log(foundCompany.length);

			if (foundCompany.length > 0) {
				console.log('already created a company');
				res.redirect('/admin');
			} else {
				res.render('admin/company/new');
			}
		}
	});
});

router.post('/admin/company', isLoggedIn, function(req, res) {
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
	Creator.find({ 'creators.id': userId }, function(err, foundCompany) {
		if (err) {
			console.log('err');
		} else {
			console.log(foundCompany.length);

			if (foundCompany.length > 0) {
				console.log('You already created a company');
				res.redirect('/admin');
			} else {
				Creator.create(newCompany, function(err, createdCompany) {
					if (err) {
						console.log(err);
					} else {
						console.log(newCompany);
						res.redirect('/admin');
					}
				});
			}
		}
	});
});

router.get('/admin/merchants/new', function(req, res) {
	res.render('admin/merchants/new');
});

router.post('/admin/merchants', function(req, res) {
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

	Merchant.create(newCompany, function(err, createdCompany) {
		if (err) {
			console.log(err);
		} else {
			console.log(newCompany);
			res.redirect('/admin');
		}
	});
});

// products  routes  ----------------------->

router.get('/admin/:id/products/new', function(req, res) {
	var userId = req.user._id;
	Creator.find({ 'creators.id': userId }, function(err, foundCompany) {
		if (err) {
			console.log('err');
		} else {
			CollectionList.findById(collectionsId, function(err, foundCollections) {
				if (err) {
					console.log(err);
					res.redirect('back');
				} else {
					res.render('admin/products/new', {
						creator: foundCompany,
						collections: foundCollections
					});
				}
			});
		}
	});
});

router.get('/admin/:id/products', function(req, res) {
	var userId = req.user._id;
	CollectionList.findById(collectionsId, function(err, foundCollections) {
		if (err) {
			console.log(err);
			res.redirect('back');
		} else {
			Product.find({ 'creator.id': userId }, function(err, foundProduct) {
				if (err) {
					console.log('err');
				} else {
					res.render('admin/products/index', { products: foundProduct });
				}
			});
		}
	});
});

router.post('/admin/:id/products', function(req, res) {
	var title = req.body.title;
	var price = req.body.price;
	var vendor = req.body.vendor;
	var tags = req.body.tags;
	var collection = req.body.collection;
	var retailPrice = req.body.retail_price;
	var inventory = req.body.inventory;
	var shipping = req.body.shipping;
	var deliveryTime = req.body.delivery_time;
	var productionTime = req.body.production_time;
	var weight = req.body.weight;
	var image = req.body.image;
	// to do var handle = title.
	var body = req.body.body;
	var creator = {
		id: req.user._id,
		username: req.user.username
	};

	var newProduct = {
		title: title,
		price: price,
		retail_price: retailPrice,
		vendor: vendor,
		tags: tags,
		image: image,
		body: body,
		creator: creator,
		weight: weight,
		collections: collection,
		weight: weight,
		production_time: productionTime,
		inventory: inventory,
		delivery_time: deliveryTime,
		shipping: shipping
	};

	var companyId = req.params.id;

	Creator.findById(companyId, function(err, foundCompany) {
		if (err) {
			console.log(err);
		} else {
			Product.create(newProduct, function(err, newlyCreated) {
				if (err) {
					console.log(err);
				} else {
					foundCompany.Products.push(newlyCreated);
					foundCompany.save();

					console.log('Added a new product');
					console.log(foundCompany.Products);
					res.redirect('/admin');
				}
			});
		}
	});
});

router.delete('/admin/products/:id', function(req, res) {
	Product.findByIdAndRemove(req.params.id, function(err) {
		if (err) {
			console.log('err');
		} else {
			res.redirect('/admin/products');
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