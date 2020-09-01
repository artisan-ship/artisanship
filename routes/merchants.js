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

router.get('/merchant/orders', (req, res) => {
	var userId = req.user._id;
	Merchant.find({ 'creators.id': userId })
		.populate('products')
		.exec(function(err, foundMerchant) {
			if (err) {
				console.log(err);

				res.redirect('/merchant');
			} else {
				res.render('merchant/orders/index', { merchant: foundMerchant[0] });
			}
		});
});

router.get('/merchant/orders/new', (req, res) => {
	var userId = req.user._id;
	Merchant.find({ 'creators.id': userId })
		.populate('products')
		.exec(function(err, foundMerchant) {
			if (err) {
				console.log(err);

				res.redirect('/merchant');
			} else {
				console.log(foundMerchant[0].customers);
				res.render('merchant/orders/new', { merchant: foundMerchant[0] });
			}
		});
});

router.post('/merchant/orders', isLoggedIn, function(req, res) {
	var userId = req.user._id;
	var customerId = req.body.customerId;
	var products = req.body.product;
	var orderProducts = [];
	var customer = '';
	var merchant = '';
	console.log(products);
	console.log(products.id);

	Product.findById(products.id, function(err, foundProduct) {
		if (err) {
			console.log(err);
		} else {
			Creator.find({"company.title" : foundProduct.vendor} , function(err, foundCreator) {
				if (err) {
					console.log(err);
				} else {
					
					console.log(foundCreator)
					Merchant.find({ 'creators.id': userId }, function(err, foundMerchant) {
						if (err) {
							console.log(err);
							res.redirect('/merchant');
						} else {
							foundMerchant[0].customers.forEach(function(foundCustomer) {
								if (foundCustomer._id == req.body.customerId) {
									customer = foundCustomer;

									var newOrder = {
										order_number: foundMerchant[0].orders.length + 1,
										customer: foundCustomer,
										product: foundProduct,
										order_count: req.body.ordercount,
										merchant: foundMerchant[0].company.title,
										creator: foundProduct.vendor,
										total_price: req.body.totalprice,
										order_status: {
											status: 'placed',
											code: 001,
											body: ' The order is placed with the creator'
										}
									};
									console.log('order created');
									foundCreator[0].orders.push(newOrder);
									foundCreator[0].save();

									foundMerchant[0].orders.push(newOrder);
									foundMerchant[0].save();
								}
							});
						}
					});
				}
			});
		}
	});

	res.redirect('back');


});

router.get('/products/:id', isLoggedIn, function(req, res) {
	Product.findById(req.params.id, function(err, foundProduct) {
		if (err) {
			console.log('err');
		} else {
			res.render('merchant/products/show', { product: foundProduct });
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

router.post('/merchant/customers/new', isLoggedIn, function(req, res) {
	var firstName = req.body.firstname;
	var lastName = req.body.lastname;
	var email = req.body.email;
	var address1 = req.body.address;
	var state = req.body.state;
	var zip = req.body.zip;
	var address2 = req.body.address2;

	var newCustomer = {
		first_name: firstName,
		last_name: lastName,
		email: email,
		address1: address1,
		address2: address2,
		zip: zip,
		province: state,
		country: 'USA'
	};

	var userId = req.user._id;
	Merchant.find({ 'creators.id': userId }, function(err, foundCompany) {
		if (err) {
			console.log('err');
		} else {
			foundCompany[0].customers.push(newCustomer);
			foundCompany[0].save();
			res.redirect('back');
		}
	});
});


router.post('/merchant/search', (req, res) => {
	var userId = req.user._id;
	Merchant.find({ 'creators.id': userId }, function(err, foundMerchant) {
		if (err) {
			console.log(err);
			res.redirect('/merchant');
		} else {
			Product.findById(req.body.id, function(err, foundProduct) {
				if (err) {
					console.log(err);
					res.redirect('/merchant');
				} else {
					//add user name

					foundMerchant[0].products.push(foundProduct);
					foundMerchant[0].save();

					res.redirect('/merchant/search');
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

router.get('/merchant/export', (req, res) => {
	var userId = req.user._id;
	Merchant.find({ 'creators.id': userId })
		.populate('products')
		.exec(function(err, foundMerchant) {
			if (err) {
				console.log(err);
				req.flash('error', 'There was a problem...');
				res.redirect('/merchant');
			} else {
				var products = foundMerchant[0];
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