var express = require('express');
var router = express.Router();
var User = require('../models/users');
var Product = require('../models/products');
var Fuse = require('fuse.js');
var Collection = require('../models/collections');
var CollectionList = require('../models/collectionslist');
var collectionsId = '5e7dad0b38af5e0f7dfe1d82';
var Notification = require("../models/notification");
var UserInfo = require('../models/user_info');
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





// products  routes  ----------------------->


// Product NEW 
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
// Product INDEX

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

// Product CREATE

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

// Product SHOW
router.get('/products/:id', middleware.isLoggedIn, function(req, res) {
	var userId = req.user._id;
	UserInfo.find({ 'user.id': userId },function (err, foundUser) {
		if (err) {
			console.log('err');
		} else {
			Product.findById(req.params.id).populate("reviews").exec(function(err, foundProduct) {
				if (err) {
					console.log(err);
				} else {
					console.log()
					res.render('admin/products/show', { userInfo: foundUser[0],product: foundProduct });
				}
			});
		
			
		}
	});

});


// Product DELETE 
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

// add product to  merchant

router.post('/admin/:id/products/:productid', middleware.isLoggedIn, middleware.checkUserOwnership, (req, res) => {
	var userId = req.user._id;
	UserInfo.find({ 'user.id': userId }, function (err, foundMerchant) {
		if (err) {
			console.log(err);
			res.redirect('/admin');
		} else {
			Product.findById(req.body.productid, function (err, foundProduct) {
				if (err) {
					console.log(err);
					res.redirect('/admin');
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

module.exports = router;