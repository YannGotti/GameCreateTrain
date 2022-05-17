var mongojs = require("mongojs");
db = mongojs('localhost:27017/myGame', ['users', 'account', 'progress']);


isValidPassword = function(data, cb){
    db.users.find({code:data.code}, function(err, res) {
        if(res.length > 0)
            cb(true);
        else
            cb(false);
    });
}

isUsernameTaken = function(data, cb){
    db.users.find({code:data.code}, function(err, res) {
        if(res.length > 0)
            cb(true);
        else
            cb(false);
    });
}

/*addUser = function(data, cb){
    db.users.insert({code:data.code}, function(err) {
        cb();
    });
} */