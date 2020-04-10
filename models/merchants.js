var mongoose = require('mongoose');

var MerchantOrdersSchema = new mongoose.Schema({
	creator:String,
	merchant: String,
	total_price:String,
	order_count: String,
	order_number: String,
	created: { type: Date, default: Date.now },
	customer: {
	first_name: String,
	last_name: String,
	email: String,
	company:String,
	address1: String,
	address2: String,
	city: String,
	province: String,
	province_code: String,
	country: String,
	country_code: String,
	zip: String,
	phone: String,
	tags: [],
	note: String,
    created: { type: Date, default: Date.now },
	},
	
	product: {
	handle: String,
	title: String,
	price: String,
	retail_price: String,
	body: String,
	vendor: String,
	image: String,
	tags: String,
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
	]

	},

	order_status: {
				status: {type: 'String'},
				code: { type: 'String' },
				body: { type: 'String' }
			},
	shop: String,
});
var MerchantOrder = mongoose.model('MerchantOrder', MerchantOrdersSchema);


var customerSchema = new mongoose.Schema({
	
	first_name: String,
	last_name: String,
	email: String,
	company:String,
	address1: String,
	address2: String,
	city: String,
	province: String,
	province_code: String,
	country: String,
	country_code: String,
	zip: String,
	phone: String,
	tags: [],
	note: String,
    created: { type: Date, default: Date.now },
  
});

var Customer = mongoose.model('Customer', customerSchema);

// create new random product
var merchantSchema = new mongoose.Schema({
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
    users: [
        {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            username: String
        }
    ],
	    export: [
        {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            },
           
        }
    ],
	    creators: [
        {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            username: String
        }
    ],
		    customers: [customerSchema],
	    orders: [MerchantOrdersSchema ],

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

module.exports = mongoose.model('Merchant', merchantSchema);