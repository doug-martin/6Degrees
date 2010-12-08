var dojo = require('../lib/dojo'),
        mongoose = require('../lib/mongoose/mongoose').Mongoose,
        fb = require("../clients/Facebook").FacebookClient,
        sys = require('sys'),
        mongo = require('mongodb'),
        fs = require("fs");
require('../domain/User');
require('../domain/ProfilePic');

var User = null;
var ProfilePicture = null;


function saveProfilePicture(userId, data, mime, callback) {
    ProfilePicture.find({user : userId}, true).one(function(pic) {
        if (pic) {
            pic.data = data;
        } else {
            pic = new ProfilePicture({data : data, user : userId, mime : mime});
        }
        pic.save();
        callback && callback();
    });
}

exports.UserUtil = dojo.declare(null, {

    constructor : function(opts) {
        var url = 'mongodb://localhost/degreesThree';
        if (opts) {
            opts.url && (url = opts.url);
        }
        this.db = mongoose.connect(url, {auto_reconnect : true});
        User = this.db.model('User');
        ProfilePicture = this.db.model('ProfilePicture');
    },

    sixDegrees : function(seeker, target, callback) {
        var found = {found : false};
        var searched = [];
        var search = function(usr, path, cb) {
            if (!found.found && searched.indexOf(usr._id.toJSON()) == -1) {
                path.push({name : usr.name, id : usr._id.toJSON()});
                searched.push(usr._id.toJSON());
                var tFound = usr.containsFriend(target._id);
                if (!tFound && path.length < 7) {
                    User.find({friends : usr._id}).all(function(users) {
                        if (!found.found) {
                            var i = 0, len = users.length;
                            for (i; i < len && !found.found; i++) {
                                var friend = users[i];
                                //make sure the current user isnt the only
                                //friend
                                if (friend.friends.length > 1) {
                                    var newPath = path.slice();
                                    search(friend, newPath, cb);
                                    if (found.found) {
                                        break;
                                    }
                                }
                            }
                        }
                    });
                } else if (tFound) {
                    found.found = tFound;
                    cb(path);
                } else {
                    cb([]);
                }
            }
        };
        User.findById(target, function(tgt) {
            target = tgt;
            if (target) {
                User.findById(seeker, function(user) {
                    if (user && user._id.toJSON() != tgt._id.toJSON()) {                        
                        search(user, [], function(path) {
                            path && path.push({name : tgt.name, id : tgt._id.toJSON()});
                            callback(path);
                        });
                    } else {
                        callback([]);
                    }
                });
            } else {
                callback([]);
            }
        });

    },

    verifyUser : function(email, password, callback) {
        User.verifyUser(email, password).one(callback);
    },

    createUser : function(userJson, callback) {
        if (userJson.fbId) {
            User.find({fbId : userJson.fbId, created : false}).one(function(user) {
                if (user) {
                    user.name = userJson.name;
                    user.dateOfBirth = userJson.dateOfBirth;
                    user.sex = userJson.sex;
                    user.password = userJson.password;
                    user.created = true;
                    user.email = userJson.email;
                    user.save();
                    callback && callback(user);
                } else {
                    var user = new User(userJson);
                    user.save();
                    callback && callback(user);
                }
            });
        } else {
            var user = new User(userJson);
            user.save();
            callback && callback(user);
        }
    },

    removeUser : function(userId, callback) {
        User.remove({_id : userId}, function(err, res) {
            callback && callback(err, res)
        });
    },

    findByFbId : function(fbId, callback) {
        User.findByFbId(fbId).one(callback);
    },

    findById : function(userId, callback) {
        User.findById(userId, callback, true);
    },

    getUserInfo : function(userId, callback) {
        User.findById(userId).one(function(usr) {
            callback && callback({dateOfBirth : usr.dateOfBirth || null, name : usr.name, sex : usr.sex, friends : usr.friends, email : usr.email || null, messages : usr.messages,id : usr._id});
        });
    },

    addFriend : function(userId, friendId, callback) {
        User.findById(userId).one(function(usr) {
            User.findById(friendId).one(function(usr2) {
                if (usr && usr2) {
                    usr.addFriend(usr2._id);
                    usr2.addFriend(usr._id);
                    usr.save(function() {
                        usr2.save(function() {
                            callback && callback(usr);
                        });
                    });
                } else {
                    callback && callback(null);
                }
            });
        });
    },

    addMessage : function(from, to, message, callback) {
        User.findById(from).one(function(from) {
            if (from) {
                User.findById(to).one(function(usr) {
                    if (usr) {
                        usr.addMessage({from : {id : from._id, name : from.name}, message : message});
                        usr.save();
                        callback && callback(usr.messages[usr.messages.length - 1]);
                    } else {
                        callback && callback(null);
                    }
                });
            } else {
                callback && callback(null);
            }

        });
    },

    retrieveAndCreateFriends : function(accessToken, user) {
        if (user && user.fbId) {
            var client = new fb();
            var def = client.getFriends(user.fbId, accessToken);
            def.addCallback(dojo.hitch(this, function(friends) {
                var friendsData = JSON.parse(friends).data;
                var defs = friendsData.map(function(friend) {
                    var def = new dojo.Deferred();
                    User.findByFbId(friend.id).one(dojo.hitch(this, function(fbUsr) {
                        if (fbUsr != null) {
                            if (user.friends.indexOf(fbUsr._id) == -1) {
                                user.friends.push(fbUsr._id);
                            }
                            if (fbUsr.friends.indexOf(user._id) == -1) {
                                fbUsr.friends.push(user._id);
                                fbUsr.save(dojo.hitch(def, def.callback));
                            } else {
                                def.callback();
                            }
                        } else {
                            var newUser = new User({
                                fbId :    friend.id,
                                name :    friend.name,
                                created : false,
                                verified : false,
                                friends : [user._id]
                            });
                            newUser.save();
                            client.getProfilePicture(friend.id, accessToken).addCallback(function(image, mime) {
                                if (image) {
                                    saveProfilePicture(newUser._id, image, mime);
                                }
                            });
                            user.friends.push(newUser._id);
                            def.callback();
                        }
                    }));
                    return def;
                }, this);
                new dojo.DeferredList(defs).addCallback(function() {
                    user.save();
                });
            }));
        }
    },

    setProfilePicture : function(userId, data, mime, callback) {
        saveProfilePicture(userId, data, mime, callback);
    },

    getProfilePicture : function(userId, callback) {
        ProfilePicture.find({user : userId}).one(function(image) {
            if (image) {
                callback && callback(image.data.buffer, image.mime);
            } else {
                callback && callback(null);
            }

        });
    },

    searchUsers : function(query, callback) {
        var q = new RegExp("^" + query + "|" + query + "\\w*$", "i");
        var r1 = new RegExp('^' + query, 'i'), r2 = new RegExp(query + '\\w*$', 'i');
        User.find({'name' : q}).all(function(users) {
            users.sort(function(a, b) {
                var ret = 0;
                var a1 = a.name.match(r1);
                var b1 = b.name.match(r1);
                if (a1 && !b1) {
                    ret = -1;
                } else if (!a1 && b1) {
                    ret = 1;
                } else if (a.name < b.name) {
                    ret = -1;
                } else if (a.name > b.name) {
                    ret = 1;
                }
                return ret;
            });
            callback && callback(users.map(function(user) {
                return {name : user.name, id : user._id};
            }));
        });
    },

    createFromFacebook : function(userJson, accessToken, callback) {
        if (userJson.fbId) {
            var client = new fb();
            User.find({fbId : userJson.fbId, created : false}).one(function(user) {
                client.getInfo(userJson.fbId, accessToken).addCallback(function(userInfo) {
                    var data = JSON.parse(userInfo);
                    var dob = data.birthday;
                    var parts = dob.split('/');
                    if (parts.length) {
                        dob = new Date();
                        dob.setFullYear(parseInt(parts[2]), parseInt(parts[0]) - 1, parseInt(parts[1]));
                    }
                    if (user) {
                        user.dateOfBirth = dob;
                        user.created = true;
                        user.sex = data.gender;
                        user.password = userJson.password;
                        user.email = userJson.email;
                    } else {
                        user = new User(dojo.mixin(userJson, {
                            name : data.name,
                            sex : data.gender,
                            dateOfBirth : dob,
                            created : true
                        }));
                    }
                    client.getProfilePicture(userJson.fbId, accessToken).addCallback(function(image, mime) {
                        if (image) {
                            saveProfilePicture(user._id, image, mime, dojo.partial(callback, user));
                        }
                    });
                    user.save();
                });
            });
        }
    }
});