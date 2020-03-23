var mongoose = require("mongoose");
var Product = require("./models/products");
var faker = require('faker');
var products = [
    {
        title: faker.commerce.productName(),
        price: faker.commerce.price(),
        department: faker.commerce.department(),
        company: faker.company.companyName(),
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcS3lRu0cpgGAdWn_8e3sTTIvR1NV7WXZR_yj3HoqHxkpX5_ywyw",

    },
    {
        title: faker.commerce.productName(),
        price: faker.commerce.price(),
        department: faker.commerce.department(),
        company: faker.company.companyName(),
        image: "https://www.thecultureist.com/wp-content/uploads/2014/03/DSC_2017.jpg",

    },
    {
        title: faker.commerce.productName(),
        price: faker.commerce.price(),
        department: faker.commerce.department(),
        company: faker.company.companyName(),
        image: "https://images-na.ssl-images-amazon.com/images/I/81YVoD9VVwL._AC_SL1500_.jpg",

    },
]
function seedDB(){
   //Remove all campgrounds
   Product.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed products!");

             //add a few campgrounds
            products.forEach(function(seed){
                Product.create(seed, function(err, product){
                    if(err){
                        console.log(err)
                    } else {
                        console.log("added a product");
                        //create a comment
           
                    }
                });
            });
        });
}
 
module.exports = seedDB;