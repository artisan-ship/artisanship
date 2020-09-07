var express = require('express');
var router = express.Router();
var mongoose =require('mongoose');
var passport = require('passport');
var User = require('../models/users');
var Product = require('../models/products');
var UserInfo = require('../models/user_info');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var Notification = require("../models/notification");
const { route } = require('./admin');
var users = "";

const tokenSchema = new mongoose.Schema({
    _userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    token: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now, expires: 43200 }
});

var Token = mongoose.model("Token", tokenSchema);

router.get('/', function (req, res) {
	Product.find({}, function (err, foundProduct) {
		if (err) {
			console.log('err');
		} else {
			res.render('home', { products: foundProduct });
		}
	});
});

router.get('/login', function (req, res) {
	res.render('login');
});

router.post(
	'/login',
	passport.authenticate('local', {
		successRedirect: '/admin',
		failureRedirect: '/login',
	}),
	function (req, res) { }
);

router.get('/register', function (req, res) {
	res.render('register');
});

router.post('/register', function (req, res) {
	User.register(new User({ username: req.body.username }), req.body.password, function (
		err,
		user
	) {
		if (err) {
			console.log(err);
			res.flash("error", err)
			return res.render('register');
		}
		passport.authenticate('local')(req, res, function () {
			UserInfo.findOne({ "email": req.body.register.email }, function (err, user) {
				if (err) {
					console.log(err);
				}
				else {
					if (user) {
						return res.redirect("/register")
					}
					else {

						UserInfo.create(req.body.register, function (err, newUser) {
							if (err) {
								console.log('break down');
							} else {

								var token = new Token({ _userId: newUser._id, token: crypto.randomBytes(16).toString('hex') });

								// Save the verification token
								token.save(function (err) {
									if (err) { return console.log(err); }

									// Send the email
									var transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: 'leon@theartisanship.com', pass: "nfdwyxajzpymajqb" } });
									var mailOptions = { from: 'leon@theartisanship.com', to: newUser.email, subject: 'Account Verification Token', text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + token.token + '.\n' };
									transporter.sendMail(mailOptions, function (err) {
										if (err) { return res.status(500).send({ msg: err.message }); }
										req.flash('success',"A verification email has been sent to " + newUser.email)
										
									});
								});
								newUser.user_id = req.user._id;
								newUser.followers = [];
								newUser.notifications = [];
								newUser.user.id = req.user._id;
								newUser.user.username = req.user.username;
								newUser.save();

								if(req.body.register.plan != "starter"){

									if(req.body.register.plan == "basic"){
										var basicPlan = {
											name:"Basic Plan",
											price: 10,
											priceId :"price_1HOJRpK9O2eoAUrKu2RZeOEV"

										}
										return res.render('checkout',{email: newUser.email,public_key: process.env.STRIPE_PUBLISHABLE_KEY,selectedPlan : basicPlan   })
										
									}

									else{

										var proPlan = {
											name:"Pro Plan",
											price: 20,
											priceId :"price_1HOJS6K9O2eoAUrKIDT3bTWP"

										}
										return res.render('checkout',{email: newUser.email,public_key: process.env.STRIPE_PUBLISHABLE_KEY,selectedPlan : proPlan })

									}

								}
								else{
									return res.redirect('/login')
								}
						
								  

								
							}
						});

					}
				}
			})

		});
	});
});




/**
* POST /confirmation
*/

router.get("/confirmation/:token",function(req,res){


	userToken = req.params.token;
	res.render('confirmation');

})


router.get("/privacy",function(req,res){


	res.render('privacy');

})


router.post("/confirmation/", function (req, res) {

 
    // Find a matching token
    Token.findOne({ token: userToken}, function (err, token) {

		console.log(token)
		
        if (!token) return res.status(400).send({ type: 'not-verified', msg: 'We were unable to find a valid token. Your token my have expired.' });
 
        // If we found a token, find a matching user
        UserInfo.findOne({ "_id": token._userId }, function (err, user) {
			console.log(user)
            if (!user) return res.status(400).send({ msg: 'We were unable to find a user for this token.' });
            if (user.isVerified) return res.status(400).send({ type: 'already-verified', msg: 'This user has already been verified.' });
		   console.log(token._userId);
		   console.log(user.user.id);
            // Verify and save the user
            user.isVerified = true;
            user.save()
			req.flash("success","Account verified please login")
			res.redirect("/login");
        });
    });
});



// user profile
router.get('/users/:id', async function(req, res) {
	try {
	  let user = await User.findById(req.params.id).populate('followers').exec();
	  res.render('profile', { user });
	} catch(err) {
	  req.flash('error', err.message);
	  return res.redirect('back');
	}
  });
  
  // follow user
  router.get('/admin/:id/follow/:userid', isLoggedIn, async function(req, res) {
	try {
	  let userfollow = await User.findById(req.user._id);
	  let user = await UserInfo.findOne({"user.id":req.params.userid});
	  user.followers.push(userfollow);
	  user.save();
	  req.flash('success', 'Successfully followed ' + user.user.username + '!');
	  res.redirect('back');
	} catch(err) {
	  req.flash('error', err.message);
	  res.redirect('back');
	}
  });
  
  // view all notifications
  router.get('/admin/:id/notifications', isLoggedIn, async function(req, res) {
	try {
	  let user = await UserInfo.findOne({"user.id":req.params.userid}).populate({
		path: 'notifications',
		options: { sort: { "_id": -1 } }
	  }).exec();
	  let allNotifications = user.notifications;
	  res.render('notifications/index', { allNotifications });
	} catch(err) {
	  req.flash('error', err.message);
	  res.redirect('back');
	}
  });
  
  // handle notification
  router.get('/admin/:userid/notifications/:id', isLoggedIn, async function(req, res) {
	try {
	  let notification = await Notification.findById(req.params.id);
	  notification.isRead = true;
	  notification.save();
	  res.redirect(`back`);
	} catch(err) {
	  req.flash('error', err.message);
	  res.redirect('back');
	}
  });



router.get('/logout', function (req, res) {
	req.logout();

	res.redirect('/');
});

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}

	res.redirect('/login');
}

module.exports = router;