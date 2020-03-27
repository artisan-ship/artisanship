var mongoose = require('mongoose');

// create new random product
var collectionListSchema = new mongoose.Schema({
	
	collections: [],
	
});

module.exports = mongoose.model('CollectionList', collectionListSchema);