
var express = require('express');
var router = express.Router()
var passport =require('passport');
var User = require("../models/users");
var Product = require('../models/products');
var Creator = require('../models/creators');
var Merchant   = require("../models/merchants");





router.get("/merchants",isLoggedIn, function(req, res){
	var  userId= req.user._id;
		Merchant.find({"creators.id": userId}).populate("Products").exec(function(err, foundMerchant){
		if(err){
			console.log("err");
		}
		else{
						console.log(foundMerchant);

				res.render("merchant/index",{merchant:foundMerchant});

		}
		
	});
	
});





router.get("/merchants/products", function(req, res){
		var  userId= req.user._id;
		Product.find({"creator.id": userId} , function(err, foundProduct){
		if(err){
			console.log("err");
		}
		else{
				res.render("merchant/products/index",{products:foundProduct});

		}
		
	});


})



router.delete("/merchants/products/:id", function(req, res){
		Product.findByIdAndRemove(req.params.id , function(err){
		if(err){
			console.log("err");
		}
		else{
				res.redirect("/merchants/products");

		}
		
	});


})


function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	
	res.redirect("/login");
}



module.exports = router