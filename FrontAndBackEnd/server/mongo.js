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


isSelectUsername = function(code, cb){
    db.users.findOne({code:code}, function(err, doc) {
        cb(doc.username.toString());
    });
}

/*addUser = function(data, cb){
    db.users.insert({code:data.code}, function(err) {
        cb();
    });
} */