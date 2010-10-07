var dojo = require('../../lib/dojo'),
        BaseDAO = require('./_BaseDAO')._BaseDAO,
        Db = require('../../lib/mongodb').Db,
        Server = require('../../lib/mongodb').Server,
        User = require('../domain/User').User;


exports.UserDAO = dojo.declare(BaseDAO, {

    _collectionName : 'users',

    getUser : function(id, callback) {
        this.findOne({'_id' : id}, function(err, user) {
            callback(err, new User(user));
        });
    },

    createUser : function(userObj, callback) {
        this.findOne({'email' : userObj.email}, dojo.hitch(this, function(err, user) {
            if (user) {
                console.log(user);
                callback({message : 'Email already is use!'});
            } else {
                if (userObj.fbId) {
                    this.findOne({'fbId' : userObj.fbId}, dojo.hitch(this, function(err, user) {
                        if (user && !user.created) {
                            userObj._id = user._id;
                            console.log('found created acount for ', userObj);
                            this.updateByObjectId(user._id, userObj, function() {
                            });
                            callback(null, userObj);
                        } else if (user) {
                            callback({message : 'Facebook account already linked!'})
                        } else {
                            this.save(userObj.toJSON(), function(err, user) {
                                callback(err, new User(user))
                            });
                        }
                    }))
                } else {
                    this.save(userObj.toJSON(), function(err, user) {
                        callback(err, new User(user))
                    });
                }
            }
        }));
    },

    createFacebookUser : function(userObj, callback) {
        this.findOne({'fbId' : userObj.fbId}, dojo.hitch(this, function(err, user) {
            if (user) {
                user.friends.push(userObj.friends);
                this.updateFriends(user._id, userObj.friends);
                callback(null, user);
            } else {
                this.save(userObj.toJSON(), function(err, user) {
                    callback(err, new User(user));
                });
            }
        }));
    },

    updateFriends : function(userId, friendIds) {
        console.log('update friends');
        this.updateByObjectId(userId, { $pushAll : { friends : friendIds } }, function() {
        });
    },

    verifyUser : function(email, password, callback) {
        this.findOne({"email" : email, "password" : password}, function(err, user) {
            callback(err, new User(user));
        });
    },

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
                        }else{
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
        this.findById(target, dojo.hitch(this, function(err, tgt) {
            if (err) {
                callback(err);
            }
            tgt = new User(tgt);
            console.log("Found target!");
            console.log(tgt);
            this.getUser(seeker, dojo.hitch(this, function(err, user) {
                if (err) {
                    callback(err);
                }
                console.log("Found Seeker!");
                console.log(user);
                search(user, [], function(path) {
                    path && path.push(tgt);
                    callback(path);
                });
            }));
        }));
    }

});