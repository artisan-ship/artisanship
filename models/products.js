var mongoose =require('mongoose');

// create new random product
var productSchema = new mongoose.Schema({
	handle: String,
    title: String,
    price: String,
	body: String,
    vendor: String,
    image: String,
	tags: String,
	created: {type: Date, default: Date.now},
	creator: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
		 ref: "User"
			
		},
		username: String
		
	},
	comments: [
		{type: mongoose.Schema.Types.ObjectId,
		 ref: "Comment"
		}
		
	]
	

});

module.exports = mongoose.model('Product', productSchema) ;
