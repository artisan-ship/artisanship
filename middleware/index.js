var User = require('../models/users');
var Product = require('../models/products');
var UserInfo = require('../models/user_info');
var passport =require('passport');

var middlewareObj = {
	
}


middlewareObj.checkUserOwnership = function(req, res, next){

    if (req.isAuthenticated()) {
        UserInfo.find({ 'user.id': req.params.id },function(err, foundUser) {
            if (err) {
						req.flash("error", "user not found");

                res.redirect('back');
            } else {
                
                if (req.params.id == req.user._id) {
                    next();
                } else {
							req.flash("error", "You don't have permission to do that");

                    res.redirect('back');
                }
            }
        });
    } else {
				req.flash("error", "Please login first");

        res.redirect('back');
    }
}

middlewareObj.checkProductOwnership = function(req, req, next){
    if (req.isAuthenticated()) {
        Product.findById(req.params.id, function(err, foundProduct) {
            if (err) {
                res.redirect('back');
            } else {
                if (foundProduct.creator.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect('back');
                }
            }
        });
    } else {
		req.flash("error", "Please login first");
        res.redirect('back');
    }



}

middlewareObj.checkProductOwnershipforReview = function(req, req, next){
   
        Product.findById(req.params.id, function(err, foundProduct) {
            if (err) {
                res.redirect('back');
            } else {
                if (foundProduct.creator.id.equals(req.user._id)) {
                    req.flash("error", "You have created this product so you are not able to review this product");
                    res.redirect('back');
                   
                } else {
                    next();
                }
            }
        });

}



middlewareObj.isLoggedIn = function(req, res, next){
	    if (req.isAuthenticated()) {
        return next();
    }
	
	req.flash("error", "Please login first");

    res.redirect('/login');
}

module.exports = middlewareObj;