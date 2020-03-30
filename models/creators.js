var mongoose = require('mongoose');


// create new random product
var creatorSchema = new mongoose.Schema({
    company: {
        title: String,
        logo: String,
        location: String,
        motto: String
    },
    body: String,
    image: String,
    tags: String,
    created: { type: Date, default: Date.now },
    creators: [
        {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            username: String
        }
    ],
	 orders: [  {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Order'
            },
         
        }],

    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],
	products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }
    ]
});

module.exports = mongoose.model('Creator', creatorSchema);