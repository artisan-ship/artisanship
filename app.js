
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
var reviewRoutes = require('./routes/reviews')
var UserInfo = require('./models/user_info');
const app = express();

app.use(cookieParser('secretString'));

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
	 } catch(err) {
	   console.log(err.message);
	 }
	}
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
 });
//seedDB()

app.use(indexRoutes);
app.use(adminRoutes);
app.use(productRoutes);
app.use(reviewRoutes);
app.use(collectionRoutes);
app.use(merchantRoutes);


app.use(function(req, res, next) {
    res.status(404);
    res.render('404-page');
});


app.listen(3000, function(){
	console.log("The Artisanship server has started");
});