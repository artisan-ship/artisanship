const User = require('./models/users');
var dotenv = require('dotenv').config();
var mongoose =require('mongoose');
mongoose.connect(
	`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_KEY}@${process.env.MONGO_URL}`, { useNewUrlParser: true, useUnifiedTopology: true }
  );
var superUser = {
    username: process.env.ADMIN_USERNAME,
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PWD,
    type: "super_user",
    isVerified: true,
    first_name: "Leon",
    last_name: "Albert",
}


User.register(new User({ username: superUser.username }), superUser.password, function (
    err,user
) {
    if (err) {
        console.log(err.message);
    }
    else {
        console.log(user);
        user.type = superUser.type;
        user.isVerified = true;
        user.first_name = "Leon";
        user.last_name = "Albert";
        user.save();
    }

})
   