var mongoose = require('mongoose');

// create new random product
var productSchema = new mongoose.Schema({
	handle: String,
	title: String,
	price: String,
	retail_price: String,
	body: String,
	vendor: String,
	image: String,
	tags: [],
	collections: String,
	weight: String,
	production_time: String,
	inventory: String,
	delivery_time: String,
	shipping: String,
	created: { type: Date, default: Date.now },
	creator: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		},
		username: String
	},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Comment'
		}
	],
	reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    rating: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Product', productSchema);