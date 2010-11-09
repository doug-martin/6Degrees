var dojo = require('../lib/dojo');
var mongoose = require('mongoose').Mongoose;

var db = mongoose.connect('mongodb://localhost/degreesTwo');
var User = db.model('User');
dojo.mixin(exports, {
    sixDegrees : function(seeker, target, callback) {
        var found = {found : false};
        var searched = [];
        var search = function(usr, path, callback) {
            if (!found.found && dojo.indexOf(searched, usr._id) == -1) {
                console.log('Searching ' + usr.name);
                path.push(usr);
                searched.push(usr._id);
                var tFound = dojo.indexOf(usr.friends, target) != -1;
                if (!tFound && path.length < 7) {
                    console.log("Not found.");
                    this.findBy({friends : usr._id}, {}, dojo.hitch(this, function(err, users) {
                        if (!found.found) {
                            console.log("Searching " + usr.name + "'s friends");
                            var i = 0, len = users.length;
                            for (i; i < len && !found.found; i++) {
                                var friend = users[i];
                                var newPath = dojo.clone(path);
                                search(friend, newPath, callback);
                            }
                        } else {
                            console.log('already found');
                        }
                    }));
                } else {
                    if (tFound) {
                        console.log('Found path through');
                        console.log(path);
                    }
                    found.found = tFound;
                    callback(tFound ? path : null);
                }
            } else {
                path = null;
                console.log('found just return');
            }
        };
        search = dojo.hitch(this, search);

        User.findById(target, dojo.hitch(this, function(err, tgt) {
            if (err) {
                callback(err);
            }
            tgt = new User(tgt);
            console.log("Found target!");
            console.log(tgt);
        }), true);

    }
});