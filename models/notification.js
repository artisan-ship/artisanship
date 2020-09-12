var mongoose = require("mongoose");

var notificationSchema = new mongoose.Schema({
	username: String,
	productId: String,
	isRead: { type: Boolean, default: false },
	created: { type: Date, default: Date.now },
	
});

module.exports = mongoose.model("Notification", notificationSchema);