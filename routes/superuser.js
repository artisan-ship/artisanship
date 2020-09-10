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


router.get('/superuser/:id', middleware.isLoggedIn, middleware.checkUserOwnership,middleware.checkIfSuperUser, function (req, res) {
	var userId = req.params.id;
	UserInfo.find({ 'user.id': userId }, function (err, foundUser) {
		if (err) {
			console.log('err');
		} else {
			res.render('superuser/index', { userInfo: foundUser[0], success: msg });
		}
	});
});

router.get('/superuser/:id/products', middleware.isLoggedIn, middleware.checkUserOwnership,middleware.checkIfSuperUser, (req, res) => {
	var userId = req.user._id;
	var perPage = 16;
	var pageQuery = parseInt(req.query.page);
	var pageNumber = pageQuery ? pageQuery : 1;

	Product.find({}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, foundProducts) {
		Product.count().exec(function (err, count) {
			if (err) {
				console.log(err);
			} else {

			
				res.render('superuser/products', {
					products: foundProducts,
					current: pageNumber,
					pages: Math.ceil(count / perPage)

				});
			}
		});
	});
}

);

// Product DELETE 
router.delete('/superuser/:id/products/:productid', middleware.isLoggedIn, middleware.checkUserOwnership, function (req, res) {

	Product.findByIdAndRemove(req.params.productid, function (err) {
		if (err) {
			console.log('err');
		} else {
			res.redirect('/superuser/' + req.params.id + '/products');
		}
	});

});


router.get('/superuser/:id/users', middleware.isLoggedIn,middleware.checkIfSuperUser, (req, res) => {
	var userId = req.user._id;
	var perPage = 16;
	var pageQuery = parseInt(req.query.page);
	var pageNumber = pageQuery ? pageQuery : 1;

	UserInfo.find({}).populate("User").skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, foundUsers) {
		UserInfo.count().exec(function (err, count) {
			if (err) {
				console.log(err);
			} else {

			
				res.render('superuser/users', {
					users: foundUsers,
					current: pageNumber,
					pages: Math.ceil(count / perPage)

				});
			}
		});
	});
}

);

// USer DELETE 
router.delete('/superuser/:id/users/:userid', middleware.isLoggedIn, middleware.checkIfSuperUser, function (req, res) {

	UserInfo.findOneAndDelete({ "user.id": req.params.userid }, function (err) {
		if (err) {
			console.log('err');
		} else {

			User.findByIdAndRemove(req.params.userid, function (err) {
				if (err) {
					console.log('err');
				} else {
					res.redirect('/superuser/' + req.params.id + '/users');
				}
			});
		}
	});




});






module.exports = router;