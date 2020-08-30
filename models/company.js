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
});

module.exports = mongoose.model('Merchant', merchantSchema);