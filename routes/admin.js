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

			res.render('admin/index', { userInfo: foundUser[0], success: msg });
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

// products  routes  ----------------------->

router.get('/admin/:id/products/new', middleware.isLoggedIn, middleware.checkUserOwnership, function (req, res) {
	var userId = req.user._id;
	UserInfo.find({ 'user.id': userId }, function (err, foundUser) {
		if (err) {
			console.log('err');
		} else {
			CollectionList.find({}, function (err, foundCollections) {
				if (err) {
					console.log(err);
					res.redirect('back');
				} else {
					console.log(foundUser);
					res.render('admin/products/new', {
						userInfo: foundUser[0],
						creator: foundUser[0],
						collections: foundCollections[0],
					});
				}
			});
		}
	});
});

router.get('/admin/:id/products', middleware.isLoggedIn, middleware.checkUserOwnership, function (req, res) {
	var userId = req.params.id;
	UserInfo.find({ 'user.id': userId })
		.populate('products')
		.exec(function (err, foundUser) {
			if (err) {
				console.log(err);

				res.redirect('/admin');
			} else {

				res.render('admin/products/index', { userInfo: foundUser[0], products: foundUser[0].products });
			}
		});
});

router.post("/admin/:id/products", middleware.isLoggedIn,middleware.checkUserOwnership,upload.single('image'), async function(req, res){
	cloudinary.uploader.upload(req.file.path, async function (result) {

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
		var image = result.secure_url;
		// to do var handle = title.
		var body = req.body.body;
		var creator = {
			id: req.user._id,
			username: req.user.username,
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
			shipping: shipping,
		};

		var userId = req.user._id;

    try {
      let product = await Product.create(newProduct);
      let user = await UserInfo.findOne({"user.id" : req.user._id}).populate('followers').exec();
      let newNotification = {
        username: req.user.username,
        productId: product.id
      }
      for(const follower of user.followers) {
		let notification = await Notification.create(newNotification);
		console.log("------")
		console.log(follower)
        follower.notifications.push(notification);
        follower.save();
	  }
	  user.products.push(product);
	  user.save();
	  req.flash("success", "The product has been created")
	  res.redirect('/admin/' + userId + '/products');

   
    } catch(err) {
      req.flash('error', err.message);
      res.redirect('back');
	}
});
});

// router.post('/admin/:id/products', middleware.isLoggedIn upload.single('image'), function (req, res) {
// 	cloudinary.uploader.upload(req.file.path, function (result) {
// 		var title = req.body.title;
// 		var price = req.body.price;
// 		var vendor = req.body.vendor;
// 		var tags = req.body.tags;
// 		var collection = req.body.collection;
// 		var retailPrice = req.body.retail_price;
// 		var inventory = req.body.inventory;
// 		var shipping = req.body.shipping;
// 		var deliveryTime = req.body.delivery_time;
// 		var productionTime = req.body.production_time;
// 		var weight = req.body.weight;
// 		var image = result.secure_url;
// 		// to do var handle = title.
// 		var body = req.body.body;
// 		var creator = {
// 			id: req.user._id,
// 			username: req.user.username,
// 		};

// 		var newProduct = {
// 			title: title,
// 			price: price,
// 			retail_price: retailPrice,
// 			vendor: vendor,
// 			tags: tags,
// 			image: image,
// 			body: body,
// 			creator: creator,
// 			weight: weight,
// 			collections: collection,
// 			weight: weight,
// 			production_time: productionTime,
// 			inventory: inventory,
// 			delivery_time: deliveryTime,
// 			shipping: shipping,
// 		};

// 		var userId = req.user._id;
		
// 		UserInfo.findOne({ 'user.id': userId },function (err, foundUser) {
// 			if (err) {
// 				console.log(err);
// 			} else {
// 				console.log("------------------")
// 				console.log(foundUser.followers)
// 				Product.create(newProduct, function (err, newlyCreated) {
// 					if (err) {
// 						console.log(err);
// 					} else {
// 						let newNotification = {
// 							username: req.user.username,
// 							productId: newlyCreated.id
// 						  }
// 						  foundUser.followers.forEach(function(follower){
// 							  console.log(follower)
// 							Notification.create(newNotification,function(err, notification){
// 								follower.notifications.push(notification);
// 								follower.save();
// 							})
						
// 						  })
						  
// 						  for(const follower of foundUser.followers) {
// 							Notification.create(newNotification)
// 							follower.notifications.push(notification);
// 							follower.save();
// 						  }

// 						foundUser.products.push(newlyCreated);
// 						foundUser.save();
// 						req.flash("success", "The product has been created")
// 						res.redirect('/admin/' + userId + '/products');
// 					}
// 				});
// 			}
// 		});

// 		// add cloudinary url for the image to the campground object under image property
// 	});
// });

router.delete('/admin/:id/products/:productid', middleware.isLoggedIn, middleware.checkUserOwnership, function (req, res) {
	var userId = req.user._id;
	UserInfo.find({ 'user.id': userId }, function (err, foundUser) {
		if (err) {
			console.log(err);
		} else {
			if (foundUser.type == 'creator') {
				Product.findByIdAndRemove(req.params.productid, function (err) {
					if (err) {
						console.log('err');
					} else {
						res.redirect('/admin/' + req.params.id + '/products');
					}
				});
			} else {
				foundUser[0].products.forEach(function (product, i) {
					console.log(product._id);
					console.log(req.params.productid);
					if (product._id == req.params.productid) {
						console.log('removed product');
						foundUser[0].products.splice(i, 1);
						foundUser[0].save();

						return res.redirect('/admin/' + req.params.id + '/products');
					}
				});
			}
		}
	});
});

router.post('/admin/:id/products/:productid', middleware.isLoggedIn, middleware.checkUserOwnership, (req, res) => {
	var userId = req.user._id;
	UserInfo.find({ 'user.id': userId }, function (err, foundMerchant) {
		if (err) {
			console.log(err);
			res.redirect('/merchant');
		} else {
			Product.findById(req.body.productid, function (err, foundProduct) {
				if (err) {
					console.log(err);
					res.redirect('/merchant');
				} else {
					//add user name

					foundMerchant[0].products.push(foundProduct);
					foundMerchant[0].save();

					res.redirect('/admin/' + userId + '/search');
				}
			});
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
				Product.find({}, function (err, foundProducts) {
					if (err) {
						console.log(err);
					} else {
						
						var products = foundUser[0].products;
						res.render('merchant/search/index', {
							userInfo: foundUser[0],
							products: foundProducts,
							merchantProducts: products,
						});
					}
				});
			}
		});
});

router.post('/admin/:id/search', middleware.isLoggedIn, (req, res) => {
	var userId = req.user._id;
	UserInfo.find({ 'user.id': userId }, function (err, foundMerchant) {
		if (err) {
			console.log(err);
			res.redirect('/merchant');
		} else {
			Product.findById(req.body.id).populate("creator").exec(function (err, foundProduct) {
				if (err) {
					console.log(err);
					res.redirect('/merchant');
				} else {
					//add user name

					foundMerchant[0].products.push(foundProduct);
					foundMerchant[0].save();

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
// Reviews Create
router.post("/products/:id/reviews", middleware.isLoggedIn, function (req, res) {
	//lookup product using ID
	Product.findById(req.params.id).populate("reviews", "creator").exec(function (err, foundProduct) {
		if (err) {
			req.flash("error", err.message);
			return res.redirect("back");
		}
		if (foundProduct.creator.id == req.user._id) {
			req.flash("error", "You have created this product so you are not able to review this product");
			res.redirect('back');

		} else {

			console.log(foundProduct)


			Review.create(req.body.review, function (err, review) {
				if (err) {
					req.flash("error", err.message);
					return res.redirect("back");
				}

				//add author username/id 
				review.author.id = req.user._id;
				review.author.username = req.user.username;
				review.product = foundProduct;
				//save review
				review.save();
				console.log("-----review-----")
				console.log(review)   

// fix rating
	
				foundProduct.save();
				req.flash("success", "Your review has been successfully added.");
				res.redirect('/products/' + foundProduct._id);


				function calculateAverage(reviews) {
					if (reviews.length === 0) {
						return 0;
					}
					var sum = 0;
					reviews.forEach(function (element) {
						sum += element.rating;
					});
					return Number(sum / reviews.length);
				}
			});
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