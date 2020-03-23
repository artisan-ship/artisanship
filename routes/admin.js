var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/users');
var Product = require('../models/products');
var Creator = require('../models/creators');
var Merchant   = require("../models/merchants");

router.get('/admin', isLoggedIn, function(req, res) {
    var userId = req.user._id;
	
    Creator.find({ 'creators.id': userId }, function(err, foundCompany) {
        if (err) {
            console.log('err');
        } else {
            res.render('admin/index', { creator: foundCompany });
        }
    });
});

//company routes --------------------------->
router.get('/admin/company/new', function(req, res) {
    res.render('admin/company/new');
});

router.post('/admin/company', function(req, res) {
    var company = req.body.company;
    var price = req.body.price;
    var tags = req.body.tags;
    var image = req.body.image;
    var body = req.body.body;
    var creator = {
        id: req.user._id,
        username: req.user.username
    };

    var newCompany = {
        company: company,
        price: price,
        tags: tags,
        image: image,
        body: body,
        creators: creator
    };

    Creator.create(newCompany, function(err, createdCompany) {
        if (err) {
            console.log(err);
        } else {
            console.log(newCompany);
            res.redirect('/admin');
        }
    });
});



router.get('/admin/merchants/new', function(req, res) {
    res.render('admin/merchants/new');
});

router.post('/admin/merchants', function(req, res) {
    var company = req.body.company;
    var price = req.body.price;
    var tags = req.body.tags;
    var image = req.body.image;
    var body = req.body.body;
    var creator = {
        id: req.user._id,
        username: req.user.username
    };

    var newCompany = {
        company: company,
        price: price,
        tags: tags,
        image: image,
        body: body,
        creators: creator
    };

    Merchant.create(newCompany, function(err, createdCompany) {
        if (err) {
            console.log(err);
        } else {
            console.log(newCompany);
            res.redirect('/admin');
        }
    });
});


// products  routes  ----------------------->

router.get('/admin/:id/products/new', function(req, res) {
	   var userId = req.user._id;
 Creator.find({ 'creators.id': userId }, function(err, foundCompany) {
        if (err) {
            console.log('err');
        } else {
            res.render('admin/products/new', { creator: foundCompany });
        }
    });
});

router.get('/admin/:id/products', function(req, res) {
    var userId = req.user._id;
    Product.find({ 'creator.id': userId }, function(err, foundProduct) {
        if (err) {
            console.log('err');
        } else {
            res.render('admin/products/index', { products: foundProduct });
        }
    });
});

router.post('/admin/:id/products', function(req, res) {
    var title = req.body.title;
    var price = req.body.price;
    var vendor = req.body.vendor;
    var tags = req.body.tags;
    var image = req.body.image;
    // to do var handle = title.
    var body = req.body.body;
    var creator = {
        id: req.user._id,
        username: req.user.username
    };

    var newProduct = {
        title: title,
        price: price,
        vendor: vendor,
        tags: tags,
        image: image,
        body: body,
        creator: creator
    };

    var companyId = req.params.id;

    Creator.findById(companyId, function(err, foundCompany) {
        if (err) {
            console.log(err);
        } else {
            Product.create(newProduct, function(err, newlyCreated) {
                if (err) {
                    console.log(err);
                } else {
					
			
                 
                    foundCompany.Products.push(newlyCreated);
                    foundCompany.save();

                    console.log('Added a new product');
					console.log(foundCompany.Products)
                    res.redirect('/admin');
                }
            });
        }
    });
});

router.delete('/admin/products/:id', function(req, res) {
    Product.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            console.log('err');
        } else {
            res.redirect('/admin/products');
        }
    });
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/login');
}

module.exports = router;