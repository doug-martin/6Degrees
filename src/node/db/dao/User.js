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
        var found = false, user = {_id : seeker};
        var currDepth = 0;
        var searchDef = new dojo.Deferred();
        var search = function(usr, tgt, depth, path, callback) {
            console.log("Searching ", usr);
            if (!found) {
                var def = this._searchChild(usr, tgt);
                def.addCallback(dojo.hitch(this, function(results) {
                    console.log("Checking results...");
                    console.log(results);                    
                    var i = 0, foundUsr = null;
                    var length = results.length;
                    var friendsList = [];
                    for (i; i < length && !foundUsr; i++) {
                        var res = results[i];
                        console.log(res);
                        friendsList.push(res.friend);
                        if (res[0].found) {
                            foundUsr = res;
                            found = true;
                        }
                    }
                    if (!found && depth < 7){
                        console.log("Not found keep searching...");
                        friendsList.forEach(function(friend){
                            search(friend, tgt, depth++, dojo.clone(path).push[friend._id], callback).apply(this);
                        });
                    }else{
                        console.log('Found = ' + found);
                        searchDef.callback(found ? path : null);
                    }
                }));
            }else{
                return;
            }
        };
        search = dojo.hitch(this, search);
        search(user, target, 0, [], function(path) {
            callback(path);
        });
    },

    _searchChild : function(friend, target) {
        var def = new dojo.Deferred();
        this.findBy({friends : friend._id}, {}, dojo.hitch(this, function(err, users) {
            var ret = this._search(target, users);
            def.callback(ret);
        }));
        return def;
    },

    _search : function(target, friendsList) {
        var retList = [];
        var ret = false, length = friendsList.length;
        for (var i = 0; i < length && !ret; i++) {
            var friend = friendsList[i];
            if (friend._id == target) {
                ret = true;
            }
            retList.push({friend : friend, found : ret});
        }
        return retList;
    }

});