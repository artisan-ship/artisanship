var mongoose =require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new mongoose.Schema({
	username: String,
	email: String,
	password: String,
	customer_id : String,
	notifications: [
    	{
    	   type: mongoose.Schema.Types.ObjectId,
    	   ref: 'Notification'
    	}
    ],
	user_id: String,
	customer_id: String,
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
	secret: String,

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
})


userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);