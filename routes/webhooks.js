
var express = require('express');
var router = express.Router();
var Order = require("../models/orders");
var User = require('../models/users');
var UserInfo = require("../models/user_info");
var nodemailer = require("nodemailer");

var emails = "";
router.post("/payload", (req, res) => {
  res.status(200).end();
  console.log(req.body);
  var newOrder = {
    order_number: req.body.please_fulfill_order,
    total_number_of_items: req.body.total_number_of_items,
    unique_items: req.body.unique_items,
    title: req.body.variant_title,
    sku: req.body.sku,
    quantity: req.body.quantity,
    vendor: req.body.vendor,
    shipping_method: req.body.shipping_method,
    tracking_number: req.body.tracking_number,
    customer_email: req.body.customer_email,
    shipping_address: req.body.shipping_address,
    order_id: req.body.id,
    order_status: {
      status: "placed",
      code: 001,
      body: " The order is placed with the creator",
    },
  };
  Order.create(newOrder, function (err, createdOrder) {
    if (err) {
      console.log(err);
    } else {
      UserInfo.find(
        {
          $or: [
            { email: req.body.sender_field_address },
            { company_title: req.body.sender_field_name },
          ],
        },
        function (err, foundMerchant) {
          if (err) {
            console.log(err);
          } else {
            // Send the email
            var transporter = nodemailer.createTransport({
              service: "gmail",
              auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS,
              },
            });
            var mailOptions = {
              from: "leon@theartisanship.com",
              to: req.body.sender_field_address,
              subject:
                "Your order " +
                req.body.please_fulfill_order +
                " has been placed with " +
                req.body.vendor,
              text:
                "Hello,\n\n" +
                'Your order has been received by the vendor, you can check out the status of your order here" : \nhttp://' +
                req.headers.host +
                "/admin/" +
                foundMerchant[0].id +
                "/orders/" +
                ".\n",
            };
            transporter.sendMail(mailOptions, function (err) {
              if (err) {
                return console.log(err);
              }
            });
            foundMerchant[0].orders.push(newOrder);

            foundMerchant[0].save();
            UserInfo.find({ company_title: req.body.vendor }, function (
              err,
              foundCreator
            ) {
              if (err) {
                console.log(err);
              } else {
                // Send the email
                var transporter = nodemailer.createTransport({
                  service: "gmail",
                  auth: {
                    user: process.env.GMAIL_USER,
                    pass: process.env.GMAIL_PASS,
                  },
                });
                var mailOptions = {
                  from: "leon@theartisanship.com",
                  to: foundCreator[0].email,
                  subject:
                    "A new  order " +
                    req.body.order_number +
                    " from " +
                    req.body.sender_field_name,
                  text:
                    "Hello,\n\n" +
                    'You have received a new  order from a mercha, you can fulfill your order here" : \nhttp://' +
                    req.headers.host +
                    "/admin/" +
                    foundCreator[0].id +
                    "/orders/" +
                    ".\n",
                };
                transporter.sendMail(mailOptions, function (err) {
                  if (err) {
                    return console.log(err);
                  }
                });
                foundCreator[0].orders.push(newOrder);

                foundCreator[0].save();
              }
            });
          }
        }
      );

      console.log("created a new order from shopify");
    }
  });
});

module.exports = router;