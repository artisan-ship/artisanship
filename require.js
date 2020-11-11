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
