var mongoose = require('mongoose');

// create new random product
var userInfoSchema = new mongoose.Schema({
    type: String,
    avatar: String,
    location: String,
    email: String,
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

    company: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'company'
        }
    },

    user: {
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
    Products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }
    ]
});

module.exports = mongoose.model('UserInfo', userInfoSchema);