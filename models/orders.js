var mongoose = require('mongoose');

// create new random product
var OrdersSchema = new mongoose.Schema({
	order_number: String,
	total_number_of_items: String,
	unique_items: String,
	title:  String,
	sku: String,
	quantity: String,
	vendor: String,
	shipping_method: String,
	tracking_number: String,
	customer_email: String,
	shipping_address: String,
	id: String,
	created: { type: Date, default: Date.now },


});

module.exports = mongoose.model('Order', OrdersSchema);