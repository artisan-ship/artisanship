var User = require('../models/users');
var Product = require('../models/products');
var UserInfo = require('../models/user_info');
var Notification = require('../models/notification');
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



middlewareObj.checkIfSuperUser = function(req, res, next) {
 if (req.isAuthenticated()) {
        UserInfo.findOne({ 'user.id': req.user._id },function(err, foundUser) {
            if (err) {
						req.flash("error", "user not found");

                res.redirect('back');
            } else {
                
                if (foundUser.type == "super_user") {
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
};


middlewareObj.checkReviewOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        Review.findById(req.params.review_id, function(err, foundReview){
            if(err || !foundReview){
                res.redirect("back");
            }  else {
                // does user own the comment?
                if(foundReview.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
};

middlewareObj.checkReviewExistence = function (req, res, next) {
    if (req.isAuthenticated()) {
        Product.findById(req.params.id).populate("reviews").exec(function (err, foundProduct) {
            if (err || !foundProduct) {
                req.flash("error", "Product not found.");
                res.redirect("back");
            } else {
                // check if req.user._id exists in foundCampground.reviews
                var foundUserReview = foundProduct.reviews.some(function (review) {
                    return review.author.id.equals(req.user._id);
                });
                if (foundUserReview) {
                    req.flash("error", "You already wrote a review.");
                    return res.redirect("/products/" + foundProduct._id);
                }
       
                next();
            }
        });
    } else {
        req.flash("error", "You need to login first.");
        res.redirect("back");
    }
}

middlewareObj.checkIfMerchant = function (req, res, next) {
    if (req.isAuthenticated()) {
        UserInfo.findOne({ "user.id": req.user._id }, function (err, foundUser) {
            if (err || !foundUser) {
                req.flash("error", "User not found.");
                res.redirect("back");
            } else {
                // check if req.user._id exists in foundCampground.reviews
                if (foundUser.type == "merchant") {
                    next();

                }
                else {
                    req.flash("error", "Only merchants are able to review products");
                    return res.redirect("/products/" + req.params.id);
                }



            }
        });
    } else {
        req.flash("error", "You need to login first.");
        res.redirect("back");
    }
};


middlewareObj.notifyReview = function (req, res, next) {
    if (req.isAuthenticated()) {
        Product.findById(req.params.id).populate("Creator").exec(function (err, foundProduct) {
            if (err || !foundProduct) {
                console.log(err)
                req.flash("error", err);
                res.redirect("back");
            } else {
             User.findById(foundProduct.creator.id, function (err, user){
                if (err || !foundProduct) {
                    req.flash("error", "User not found.");
                    res.redirect("back");
                } else {
                    let newNotification = {
                        username: req.user.username,
                        productId: foundProduct.id
                      }
                      Notification.create(newNotification, function(err,notification){
                        user.notifications.push(notification)
                        user.save()
                      next();
                      });
                     
                }
             });
            }
        });
    } else {
        req.flash("error", "You need to login first.");
        res.redirect("back");
    }
};


module.exports = middlewareObj;