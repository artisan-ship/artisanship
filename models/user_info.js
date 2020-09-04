var mongoose = require('mongoose');


//order schema 
var MerchantOrdersSchema = new mongoose.Schema({
	creator: String,
	merchant: String,
	total_price: String,
	order_count: String,
	order_number: String,
	created: { type: Date, default: Date.now },
	customer: {
		first_name: String,
		last_name: String,
		email: String,
		company: String,
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
				ref: 'User',
			},
			username: String,
		},
		comments: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Comment',
			},
		],
	},

	order_status: {
		status: { type: 'String' },
		code: { type: 'String' },
		body: { type: 'String' },
	},
	shop: String,
});

//customer schema

var customerSchema = new mongoose.Schema({
	first_name: String,
	last_name: String,
	email: String,
	company: String,
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


// token schema
const tokenSchema = new mongoose.Schema({
    _userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    token: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now, expires: 43200 }
});

var userInfoSchema = new mongoose.Schema({
	user_id: String,
	company_title: String,
	company_logo: String,
	tags: String,
	type: String,
	avatar: String,
	location: String,
	email: String,
	isVerified: { type: Boolean, default: false },
	created: { type: Date, default: Date.now },
	first_name: String,
	middle_name: String,
	last_name: String,
	gender: String,
	birthdate: String,
	motto: String,
	title: String,
	role: String,
	body: String,

	companies: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'company',
		},
	},

	user: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		username: String,
	},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Comment',
		},
	],
	customers: [customerSchema],
	orders: [MerchantOrdersSchema],
	products: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Product',
		},
	],


    followers: [
    	{
    		type: mongoose.Schema.Types.ObjectId,
    		ref: 'User'
    	}
    ]
});

module.exports = mongoose.model('UserInfo', userInfoSchema);