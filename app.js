
const express = require('express');
var flash = require('connect-flash');
var cookieParser = require('cookie-parser')
var dotenv = require('dotenv').config();
var passport =require('passport');
const  bodyParser = require('body-parser');
var User = require("./models/users");
var Creator = require("./models/creators")
var localStrategy = require('passport-local');
var methodOverride = require('method-override');
var Order = require("./models/orders");
var Product   = require("./models/products");
var Merchant   = require("./models/merchants");
var passportLocalMongoose = require('passport-local-mongoose');
var mongoose =require('mongoose');
var seed = require('./seeds');
var indexRoutes = require('./routes/index');
var adminRoutes = require('./routes/admin');
var merchantRoutes = require('./routes/merchants');
var collectionRoutes = require('./routes/collections');
var productRoutes = require('./routes/products');
var superUserRoutes = require('./routes/superuser');
var nodemailer = require('nodemailer');
var reviewRoutes = require('./routes/reviews')
var UserInfo = require('./models/user_info');
const { json } = require('body-parser');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const winston = require('winston');
 
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    //
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs with level `info` and below to `combined.log`
    //
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});
 
//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}
const app = express();

app.use(cookieParser('secretString'));



app.use(flash());

mongoose.connect(
	`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_KEY}@${process.env.MONGO_URL}`, { useNewUrlParser: true, useUnifiedTopology: true }
  );
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs")
app.use(bodyParser.json())

app.use(express.static(__dirname + "/public"))
app.use(methodOverride("_method"));
// passport setup

app.use(require("express-session")({
	secret: "frank the cat is awesome",
	resave: false,
	saveUninitialized: false
}));



app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
// Error Handling Helper Function


app.use(async function(req, res, next){
	res.locals.currentUser = req.user;
	if(req.user) {
	 try {
	   let user = await User.findById( req.user._id).populate('notifications', null, { isRead: false }).exec();
	   res.locals.notifications = user.notifications.reverse();
	   console.log(user);
	   const customer = await stripe.subscriptions.retrieve(
		user.customer_id
	  );
	  if(typeof customer == "undefined"){
		res.locals.customerplan = 'free';
	  }
	  res.locals.customerplan = customer;
	 
	 } catch(err) {
		console.log("----------------")
	   console.log(err.message);
	 }
	}
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	res.locals.proPlan = "prod_HyFyvT1iy6BjgB";
	res.locals.basicPlan = "prod_HyFxPWyEYmknSi";
	next();
 });
//seedDB()

app.use(indexRoutes);
app.use(adminRoutes);
app.use(productRoutes);
app.use(reviewRoutes);
app.use(collectionRoutes);
app.use(superUserRoutes);
app.use(merchantRoutes);

const calculateOrderAmount = items => {
	// Replace this constant with a calculation of the order's amount
	// Calculate the order total on the server to prevent
	// people from directly manipulating the amount on the client
	return 1400;
  };



var emails = "";
  app.post("/payload", (req, res) => {
	res.status(200).end();
	console.log(req.body);
	var newOrder = { 
		order_number: req.body.please_fulfill_order,
		total_number_of_items: req.body.total_number_of_items,
		unique_items: req.body.unique_items,
		title:  req.body.variant_title,
		sku: req.body.sku,
		quantity: req.body.quantity,
		vendor: req.body.vendor,
		shipping_method: req.body.shipping_method,
		tracking_number: req.body.tracking_number,
		customer_email: req.body.customer_email,
		shipping_address: req.body.shipping_address,
		order_id: req.body.id,
		order_status: {
			status: 'placed',
			code: 001,
			body: ' The order is placed with the creator',
		},
	}
	Order.create(newOrder,function(err,createdOrder){
		if(err){
			console.log(err);
		}else{
	

			UserInfo.find({$or:[{ "email": req.body.sender_field_address },{"company_title": req.body.sender_field_name }]}, function (err, foundMerchant) {
				if (err) {
					console.log(err);
				} else {
							// Send the email
							var transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_PASS } });
							var mailOptions = { from: 'leon@theartisanship.com', to: req.body.sender_field_address, subject: 'Your order ' + req.body.please_fulfill_order + " has been placed with " + req.body.vendor, text: 'Hello,\n\n' + 'Your order has been received by the vendor, you can check out the status of your order here" : \nhttp:\/\/' + req.headers.host + '\/admin\/' + foundMerchant[0].id  + '\/orders\/' +  '.\n' };
							transporter.sendMail(mailOptions, function (err) {
								if (err) { return console.log(err) }
								
								
							});
					foundMerchant[0].orders.push(newOrder);
					
					foundMerchant[0].save();
					UserInfo.find({ "company_title": req.body.vendor }, function (err, foundCreator) {
						if (err) {
							console.log(err);
						} else {
								// Send the email
								var transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_PASS } });
								var mailOptions = { from: 'leon@theartisanship.com', to: foundCreator[0].email, subject: 'A new  order ' + req.body.order_number + " from " + req.body.sender_field_name, text: 'Hello,\n\n' + 'You have received a new  order from a mercha, you can fulfill your order here" : \nhttp:\/\/' + req.headers.host + '\/admin\/' + foundCreator[0].id  + '\/orders\/' +  '.\n' };
								transporter.sendMail(mailOptions, function (err) {
									if (err) { return console.log(err) }
									
									
								});
							foundCreator[0].orders.push(newOrder);
							
							foundCreator[0].save();
						}
					});
				}
			});


			console.log("created a new order from shopify")
		}
	})

  })

  app.get('/checkout', async (req, res) => {


	res.render('checkout', { client_secret: intent.client_secret, public_key: process.env.STRIPE_PUBLISHABLE_KEY });
  });
  
  
  app.post('/checkout', async (req, res) => {	
	  

	function createCustomerAndSubscription(requestBody) {

		return stripe.customers.create({
		  source: requestBody.stripeToken,
		  email: requestBody.email
		}).then(customer => {
		  stripe.subscriptions.create({
			customer: customer.id,
			items: [
			  {
				price: requestBody.priceId
			  }
			]
		  }).then(customer =>{
			  User.findById(req.user._id,function(err, foundUser){
				  foundUser.customer_id = customer.id
				  foundUser.save();
			  })
		  });
		});
	  }
	

   createCustomerAndSubscription(req.body).then(() => {
	   req.flash("success","Sign up sucessful please login and verify your email");
	  res.redirect('/login');
	}).catch(err => {
		console.log(err);
		req.flash("error","Something went wrong please try again or contact support");
		res.redirect('/register');
	
	});
  });



app.use(function(req, res, next) {
    res.status(404);
    res.render('404-page');
});


app.listen(3000, function(){
	console.log("The Artisanship server has started");
});