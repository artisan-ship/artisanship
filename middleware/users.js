var User = require('../models/users');

var middlewareObj = {

}


middlewareObj.checkSecret = function (req, res, next) {
    User.findById(req.query.id, function (err, foundUser) {
        if(err){
            console.log(err);
            res.status(500);
            res.send('Internal Server Error');
        }
        if (foundUser.type === 'super_user' && foundUser.secret == req.query.secret) {
            next();
        }
        else {
            res.status(400);
            res.send("Bad Request");
        }
    });
}




module.exports = middlewareObj;