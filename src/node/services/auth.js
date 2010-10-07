var UserDAO = require('../db/dao/User').UserDAO;
var fb = require("../clients/Facebook").FacebookClient;
var dojo = require('../lib/dojo');
var User = require('../db/domain/User').User;


var db = new UserDAO();
var client = new fb();

var APP_ACCESS_TOKEN = '150801354942182';

var verifyUser = function(user) {
    var ret = false;
    if (user) {
        ret = (user.firstName && user.lastName && user.email && user.dateOfBirth && user.sex);
    }
    return ret;
};

exports.checkStatus = function(req, res) {
    var session = req.session;
    if (session.data('user')) {
        res.redirect('/6Degrees/home');
    } else {
        res.redirect('/6Degrees/logon');
    }
};

exports.login = function(email, password, req, res) {
    var session = req.session;
    db.verifyUser(email, password, function(error, user) {
        var obj;
        if (user) {
            session.data('user', user._id);
            obj = {
                location : '/6Degrees/home'
            };
        } else {
            obj = {
                error : 'Invalid Username and Password'
            };
        }
        res.simpleJSON(200, obj);
    });
};

exports.logout = function(req, res) {
    req.session.destroy(res);
};

exports.createUser = function(user, req, res) {
    if (user) {
        user = new User(user);
        user.created = true;
        var cookie = req.getCookie('fbs_' + APP_ACCESS_TOKEN);
        console.log(cookie);
        cookie && (user.fbId = cookie['uid']);
        db.createUser(user, function(error, newUser) {
            var obj;
            if (error) {
                obj = {
                    error : error.message
                };
            } else {
                cookie && retrieveAndCreateFriends(cookie, newUser._id)
                req.session.data('user', newUser._id);
                obj = {
                    location : '/6Degrees/home'
                };
            }
            res.simpleJSON(200, obj);
        });
    }

};

var retrieveAndCreateFriends = function(cookie, userId) {
    if (cookie) {
        console.log('creating friends');
        var access_token = cookie['access_token'];
        var uid = cookie['uid'];
        var def = client.getFriends(uid, access_token);
        def.addCallback(dojo.hitch(function(friends) {
            console.log('Recieved friends');
            var friendsData = JSON.parse(friends).data;
            var friendList = [];
            console.log('Looping friends');
            var defs = friendsData.map(function(friend) {
                var user = new User({
                    fbId :    friend.id,
                    name :    friend.name,
                    friends : [userId]
                });
                var def = new dojo.Deferred();
                db.createFacebookUser(user, function(err, user) {
                    friendList.push(user._id);
                    def.callback();                    
                });
                return def;
            });
            console.log('Done looping friends');
            console.log(defs.length);
            new dojo.DeferredList(defs).addCallback(function() {
                console.log("DEF LIST CALLBACK");
                db.updateFriends(userId, friendList);
            });
        }));
    }
};
