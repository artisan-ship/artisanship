const express = require('express');
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
// var seed = require('./seeds')
// var productRoutes = require('./routes/products');
var indexRoutes = require('./routes/index')
var adminRoutes = require('./routes/admin')
var merchantRoutes = require('./routes/merchants')
var collectionRoutes = require('./routes/collections')
var UserInfo = require('./models/user_info');



const app = express();

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



app.use(function(req, res , next){
	res.locals.currentUser = req.user;
	next();
})

//seedDB()

app.use(indexRoutes);
app.use(function(req, res , next){
	res.locals.currentUser = req.user;

	if(typeof req.user.id === "undefined"){
		console.log("test");
	}
	else{
		UserInfo.find({ 'user.id': req.user.id }, function(err, foundUser) {
			if (err) {
				console.log('err');
			} else {
				res.locals.userInfo = foundUser[0];
			}
		}
		)
	}

	next();
})
app.use(adminRoutes);
app.use(collectionRoutes);
app.use(merchantRoutes);


function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	
	res.redirect("/login");
}





app.listen(3000, function(){
	console.log("The Artisanship server has started");
});