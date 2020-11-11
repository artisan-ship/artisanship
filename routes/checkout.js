var express = require('express');
var router = express.Router();
var User = require('../models/users');

router.get('/checkout', async (req, res) => {


    res.render('checkout', { client_secret: intent.client_secret, public_key: process.env.STRIPE_PUBLISHABLE_KEY });
});


router.post('/checkout', async (req, res) => {


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
            }).then(customer => {
                User.findById(req.user._id, function (err, foundUser) {
                    foundUser.customer_id = customer.id
                    foundUser.save();
                })
            });
        });
    }


    createCustomerAndSubscription(req.body).then(() => {
        req.flash("success", "Sign up sucessful please login and verify your email");
        res.redirect('/login');
    }).catch(err => {
        console.log(err);
        req.flash("error", "Something went wrong please try again or contact support");
        res.redirect('/register');

    });
});


module.exports = router;