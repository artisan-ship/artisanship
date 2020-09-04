
var express = require('express');
var router = express.Router();
var Product = require('../models/products');
var Review = require("../models/reviews");
var middleware = require('../middleware/index');



// Reviews CREATE
router.post("/products/:id/reviews", middleware.isLoggedIn,middleware.checkReviewExistence,middleware.checkIfMerchant, function (req, res) {
    //lookup campground using ID
    Product.findById(req.params.id).populate("reviews").exec(function (err, foundProduct) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("back");
        }

        console.log(req.body.review)
        Review.create(req.body.review, function (err, review) {
            if (err) {
                req.flash("error", err.message);
                return res.redirect("back");
            }
    
            review.author.id = req.user._id;
            review.author.username = req.user.username;
            review.product = foundProduct;
            review.save();

            foundProduct.reviews.push(review);
            console.log(calculateAverage(foundProduct.reviews))
            foundProduct.rating = calculateAverage(foundProduct.reviews);
            foundProduct.save();
            req.flash("success", "Your review has been successfully added.");
            res.redirect('/products/' + foundProduct._id);

            function calculateAverage(reviews) {
                if (reviews.length === 0) {
                    return 0;
                }
                var sum = 0;
                reviews.forEach(function (element) {
                   
                    sum += Number(element.rating);
                   
                   
                });
                return sum / reviews.length;
            }
        });
    });
});


module.exports = router;