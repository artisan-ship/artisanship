//packages
const express = require("express");
var flash = require("connect-flash");
var cookieParser = require("cookie-parser");
var dotenv = require("dotenv").config();
var passport = require("passport");
const bodyParser = require("body-parser");
var localStrategy = require("passport-local");
var methodOverride = require("method-override");
var passportLocalMongoose = require("passport-local-mongoose");
var mongoose = require("mongoose");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const winston = require("winston");
var nodemailer = require("nodemailer");

// routes
var indexRoutes = require("./routes/index");
var adminRoutes = require("./routes/admin");
var merchantRoutes = require("./routes/merchants");
var collectionRoutes = require("./routes/collections");
var productRoutes = require("./routes/products");
var superUserRoutes = require("./routes/superuser");
var checkoutRoutes = require("./routes/checkout");
var reviewRoutes = require("./routes/reviews");
var webhooks = require("./routes/webhooks");
//models 
var UserInfo = require("./models/user_info");
var User = require("./models/users");
var Creator = require("./models/creators");
var Order = require("./models/orders");
var Product = require("./models/products");
var Merchant = require("./models/merchants");

//other
var seed = require("./seeds");

//init
const { json } = require("body-parser");
const app = express();
app.use(cookieParser("secretString"));
app.use(flash());
mongoose.connect("mongodb://localhost/artisanship", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));


// passport setup
app.use(
  require("express-session")({
    secret: "frank the cat is awesome",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Error Handling Helper Function

app.use(async function (req, res, next) {
  res.locals.currentUser = req.user;
  if (req.user) {
    try {
      let user = await User.findById(req.user._id)
        .populate("notifications", null, { isRead: false })
        .exec();
        res.locals.notifications = user.notifications.reverse();
        if (user.customer_id){
          const customer = await stripe.subscriptions.retrieve(user.customer_id);
          if (typeof customer == "undefined") {
            res.locals.customerplan = "free";
          }
          res.locals.customerplan = customer;
        }

    } catch (err) {
      console.log(err.message);
    }
  }
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  res.locals.proPlan = "prod_HyFyvT1iy6BjgB";
  res.locals.basicPlan = "prod_HyFxPWyEYmknSi";
  next();
});

// routes 
app.use(indexRoutes);
app.use(adminRoutes);
app.use(productRoutes);
app.use(reviewRoutes);
app.use(collectionRoutes);
app.use(superUserRoutes);
app.use(merchantRoutes);
app.use(checkoutRoutes);
app.use(webhooks);

app.use(function (req, res, next) {
  res.status(404);
  res.render("404-page");
});

app.listen(3000, function () {
  console.log("The Artisanship server has started");
});
