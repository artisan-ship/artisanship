var mongoose = require("mongoose");
var Product = require("./models/products");
var faker = require('faker');
var products = require('./data.json');
var Collections = require('./models/collectionslist');


var collectionsListData = ['Home','Beaty','Food','Fashion','Tools','Jewelry',"Hobby",'Toys',"Sports","Bags","Custom","Other"]


function seedDB(){
//    //Remove all campgrounds
//    Product.remove({}, function(err){
//         if(err){
//             console.log(err);
//         }
//         console.log("removed products!");

//              //add a few campgrounds
//             products.forEach(function(product){
				
// 				var productSeed = {
// 					title: product.name,
// 					body:product.description,
// 					vendor :product.vendor,
// 					image: product.image,
// 					price: product.price,
// 					retail_price : product.price *1.5
// 				}
//                 Product.create(productSeed, function(err, product){
//                     if(err){
//                         console.log(err)
//                     } else {
//                         console.log("added a product");
//                         //create a comment
           
//                     }
//                 });
//             });
//         });

        Collections.remove({}, function(err){
            if(err){
                console.log(err);
            }
            else{
                console.log("removed all Collections!");
                collectionToCreate = {collections: collectionsListData }
      
                Collections.create(collectionToCreate, function(err, createdList){
                    if(err){
                        console.log(err)
                    } else {
                        console.log("seed complete")
                     
                    }
                })


            }
           

     
          
                });
         
}




 
