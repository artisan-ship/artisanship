var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/users');
var Product = require('../models/products');
var Fuse = require('fuse.js');
var Creator = require('../models/creators');
var Merchant = require('../models/merchants');
var Collection = require('../models/collections');
var CollectionList = require('../models/collectionslist');
var collectionsId = '5e7dad0b38af5e0f7dfe1d82';
var Notification = require("../models/notification");
var UserInfo = require('../models/user_info');
var Order = require('../models/orders');
var Review = require("../models/reviews");
var middleware = require('../middleware/index');

var multer = require('multer');
var storage = multer.diskStorage({
	filename: function (req, file, callback) {
		callback(null, Date.now() + file.originalname);
	},
});
var imageFilter = function (req, file, cb) {
	// accept image files only
	if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
		return cb(new Error('Only image files are allowed!'), false);
	}
	cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter });

var cloudinary = require('cloudinary');
cloudinary.config({
	cloud_name: 'artisanship',
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

//------------- start of routes ---------------

// admin index routes
router.get('/admin', middleware.isLoggedIn, function (req, res) {
	var userId = req.user._id;
	if (!userId) {
		res.redirect('/register');
	} else {
		


		res.redirect('/admin/' + userId);
	}
});

router.get('/admin/:id', middleware.isLoggedIn, middleware.checkUserOwnership, function (req, res) {
	var userId = req.params.id;
	UserInfo.find({ 'user.id': userId }, function (err, foundUser) {
		if (err) {
			console.log('err');
		} else {

			if (!foundUser[0].isVerified) {
				msg = "please verify your account";
			}
			else {
				msg = "Welcome back " + foundUser[0].first_name;
			}

			if(foundUser[0].type == "super_user"){
				res.redirect("/superuser/" + userId);
			}

			res.render('admin/index', { userInfo: foundUser[0], success: msg });
		}
	});
});


router.get('/admin/:id/settings', middleware.isLoggedIn, middleware.checkUserOwnership, function (req, res) {
	var userId = req.params.id;
	UserInfo.find({ 'user.id': userId }, function (err, foundUser) {
		if (err) {
			console.log('err');
		} else {


			res.render('admin/settings', { userInfo: foundUser[0] });
		}
	});
});




// --------------------------------order routes -----------------------------

router.get('/admin/:id/orders', middleware.isLoggedIn, middleware.checkUserOwnership, (req, res) => {
	var userId = req.user._id;
	UserInfo.find({ 'user.id': userId })
		.populate('Orders')
		.exec(function (err, foundUser) {
			if (err) {
				console.log(err);

				res.redirect('/admin');
			} else {
				var orders = foundUser[0].orders;
				res.render('admin/orders/index', { userInfo: foundUser[0] });
			}
		});
});

router.get('/admin/:id/orders/new', middleware.isLoggedIn, middleware.checkUserOwnership, (req, res) => {
	var userId = req.user._id;
	UserInfo.find({ 'user.id': userId })
		.populate('products')
		.exec(function (err, foundUser) {
			if (err) {
				console.log(err);

				res.redirect('/merchant');
			} else {
				res.render('merchant/orders/new', { userInfo: foundUser[0] });
			}
		});
});

router.post('/admin/:id/orders', middleware.isLoggedIn, middleware.checkUserOwnership, function (req, res) {
	var userId = req.user._id;
	var customerId = req.body.customerId;
	var products = req.body.product;
	var orderProducts = [];
	var customer = '';
	var merchant = '';


	Product.findById(products.id, function (err, foundProduct) {
		if (err) {
			console.log(err);
		} else {
			UserInfo.find({ company_title: foundProduct.vendor }, function (err, foundCreator) {
				if (err) {
					console.log(err);
				} else {
					console.log(foundCreator);
					UserInfo.find({ 'user.id': userId }, function (err, foundMerchant) {
						if (err) {
							console.log(err);
							res.redirect('/admin');
						} else {
							foundMerchant[0].customers.forEach(function (foundCustomer) {
								if (foundCustomer._id == req.body.customerId) {
									customer = foundCustomer;

									var newOrder = {
										order_number: foundMerchant[0].orders.length + 1,
										customer: foundCustomer,
										product: foundProduct,
										order_count: req.body.ordercount,
										merchant: foundMerchant[0].company_title,
										creator: foundProduct.vendor,
										total_price: req.body.totalprice,
										order_status: {
											status: 'placed',
											code: 001,
											body: ' The order is placed with the creator',
										},
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
// router.post('/admin/:id/orders', (req, res) => {
// 	ShopifyUser.find({ shopname: req.body.shop }, function(err, foundShop) {
// 		if (err) {
// 			console.log(err);
// 		} else {
// 			var order =
// 				foundShop[0].pending_orders[
// 					foundShop[0].pending_orders.indexOf(req.body.order_number)
// 				];
// 			foundShop[0].pending_orders.forEach(function(foundOrder) {
// 				foundOrder.orders.forEach(function(orderFound) {
// 					orderFound.line_items.forEach(function(item) {
// 						if (item.id == req.body.itemId) {
// 							console.log('match');
// 							console.log(req.body.itemId);
// 							item.status_code = {
// 								status: 'Shipped',
// 								body: 'Being shipped to the Customer'
// 							};
// 							foundShop[0].save();
// 							console.log(item);
// 						} else {
// 							console.log('no match');
// 							console.log(req.body.itemId);
// 							console.log(item.id);
// 						}
// 					});
// 				});
// 			});

// 			res.redirect('/admin/orders');
// 		}
// 	});
// });

router.get('/admin/merchants/new', middleware.isLoggedIn, middleware.checkUserOwnership, function (req, res) {
	res.render('admin/merchants/new');
});

router.post('/admin/merchants', isLoggedIn, function (req, res) {
	var company = req.body.company;
	var price = req.body.price;
	var tags = req.body.tags;
	var image = req.body.image;
	var body = req.body.body;
	var creator = {
		id: req.user._id,
		username: req.user.username,
	};

	var newCompany = {
		company: company,
		price: price,
		vendor: vendor,
		tags: tags,
		image: image,
		body: body,
		creators: creator,
	};

	Merchant.create(newCompany, function (err, createdCompany) {
		if (err) {
			console.log(err);
		} else {
			console.log(newCompany);
			res.redirect('/admin');
		}
	});
});



// ---------------search routes
router.get('/admin/:id/search', middleware.isLoggedIn, (req, res) => {
	var userId = req.user._id;
	UserInfo.find({ 'user.id': userId })
		.populate('products')
		.exec(function (err, foundUser) {
			if (err) {
				console.log(err);
				req.flash('error', 'There was a problem...');
				res.redirect('/admin');
			} else {
				var perPage = 16;
				var pageQuery = parseInt(req.query.page);
				var pageNumber = pageQuery ? pageQuery : 1;

				Product.find({}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, foundProducts) {
					Product.count().exec(function (err, count) {
						if (err) {
							console.log(err);
						} else {

							var products = foundUser[0].products;
							res.render('merchant/search/index', {
								userInfo: foundUser[0],
								products: foundProducts,
								merchantProducts: products,
								current: pageNumber,
								pages: Math.ceil(count / perPage)

							});
						}
					});
				});
			}
		});
});

router.post('/admin/:id/search', middleware.isLoggedIn, (req, res) => {
	var userId = req.user._id;
	UserInfo.find({ 'user.id': userId }, function (err, foundMerchant) {
		if (err) {
			console.log(err);
			res.redirect('/admin');
		} else {
			Product.findById(req.body.id).populate("Creator").exec(function (err, foundProduct) {
				if (err) {

					req.flash("error", "Oh no! Something went wrong...")
					res.redirect('/admin');
				} else {
					//add user name

					foundMerchant[0].products.push(foundProduct);
					foundMerchant[0].save();
					req.flash("success", "Successfully added this product")
					res.redirect('/admin/' + userId + '/search');
				}
			});
		}
	});
});



router.get('/admin/:id/search/:term', middleware.isLoggedIn, middleware.checkUserOwnership, function (req, res) {
	var userId = req.user._id;
	UserInfo.find({ 'user.id': userId }).populate('products').exec(function (err, foundUser) {
		if (err) {
			console.log(err);
			res.redirect('/merchant');
		} else {
			Product.find({}, function (err, foundProducts) {
				if (err) {
					console.log(err);
					res.redirect('/merchant');
				} else {
					var products = foundUser.products;
					var options = {
						keys: [
							{
								name: 'title',
								weight: 0.9,
							},
						],
					};
					var fuse = new Fuse(foundProducts, options);
					var searchResult = fuse.search(req.params.term);

					if (searchResult.length > 0) {
						var searchArray = [searchResult[0].item];

						res.render('merchant/search/index', {
							products: searchArray,
							merchantProducts: products,
						});
					} else {
						res.render('merchant/search/index', {
							userInfo: foundUser[0],
							products: foundProducts,
							merchantProducts: products,
						});
					}
				}
			});
		}
	});

});

// -----------------------export routes ----------------------------------------

router.get('/admin/:id/export', middleware.isLoggedIn, middleware.checkUserOwnership, (req, res) => {
	var userId = req.user._id;
	UserInfo.find({ 'user.id': userId })
		.populate('products')
		.exec(function (err, foundUser) {
			if (err) {
				console.log(err);
				req.flash('error', 'There was a problem...');
				res.redirect('/admin');
			} else {

				var products = foundUser[0].products;
				console.log(products)
				res.render('merchant/export/index', { products: products, userInfo: foundUser[0] });
			}
		});
});

//-----------------------customer route ---------------------------

router.post('/admin/:id/customers/new', middleware.isLoggedIn, middleware.checkUserOwnership, function (req, res) {
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
		country: 'USA',
	};

	var userId = req.user._id;
	UserInfo.find({ 'user.id': userId }, function (err, foundCompany) {
		if (err) {
			console.log('err');
		} else {
			foundCompany[0].customers.push(newCustomer);
			foundCompany[0].save();
			res.redirect('/admin');
		}
	});
});



function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}

	res.redirect('/login');
}





router.post('/admin/:id/change', middleware.isLoggedIn, middleware.checkUserOwnership, (req, res) => {
	User.findById(req.user._id, function (err, foundUser) {
		if(err){
			console.log(err);
			res.redirect("back");
		}
		else{
			console.log(foundUser);
			foundUser.changePassword(req.body.oldPassword, req.body.newPassword, function(err,){
				if(err){
					console.log(err);
					req.flash("error", err);
					res.redirect("back");
				}else{
					req.flash("success", "You have successfully changed your password");
					res.redirect("back");
				}
			});
		}

	})
});


router.get('/admin/:id/notifications', middleware.isLoggedIn, middleware.checkUserOwnership, (req, res) => {
	var userId = req.user._id;

	UserInfo.find({ 'user.id': userId }, function (err, foundUser) {
		if (err) {
			console.log('err');
		} else {

			User.findById(userId)
			.populate({
				path: 'notifications',
				options: { sort: { "_id": -1 } }
			})
			.exec(function (err, user) {
				if (err) {
					console.log(err);
					req.flash('error', 'There was a problem...' + err.message);
					res.redirect('/admin');
				} else {

					res.render('admin/notifications', {  userInfo: foundUser[0], notifications: user.notifications });
				}
			});

		
		}
	});

});



module.exports = router;