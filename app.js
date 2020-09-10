
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
var reviewRoutes = require('./routes/reviews')
var UserInfo = require('./models/user_info');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();

app.use(cookieParser('secretString'));





var Imap = require('imap'),
    inspect = require('util').inspect;
 
var imap = new Imap({
  user: 'orders@theartisanship.com',
  password: 'asorders2020',
  host: 'imap.gmail.com',
  port: 993,
  tls: true
});
 
function openInbox(cb) {
  imap.openBox('INBOX', true, cb);
}
 
imap.once('ready', function() {
  openInbox(function(err, box) {
    if (err) throw err;
    var f = imap.seq.fetch('1:3', {
      bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE)',
      struct: true
    });
    f.on('message', function(msg, seqno) {
      console.log('Message #%d', seqno);
      var prefix = '(#' + seqno + ') ';
      msg.on('body', function(stream, info) {
        var buffer = '';
        stream.on('data', function(chunk) {
          buffer += chunk.toString('utf8');
        });
        stream.once('end', function() {
          console.log(prefix + 'Parsed header: %s', inspect(Imap.parseHeader(buffer)));
        });
      });
      msg.once('attributes', function(attrs) {
        console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
      });
      msg.once('end', function() {
        console.log(prefix + 'Finished');
      });
    });
    f.once('error', function(err) {
      console.log('Fetch error: ' + err);
    });
    f.once('end', function() {
      console.log('Done fetching all messages!');
      imap.end();
    });
  });
});
 
imap.once('error', function(err) {
  console.log(err);
});
 
imap.once('end', function() {
  console.log('Connection ended');
});
 
imap.connect();



app.use(flash());


mongoose.connect('mongodb://localhost/artisanship', {useNewUrlParser: true,  useUnifiedTopology : true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs")


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