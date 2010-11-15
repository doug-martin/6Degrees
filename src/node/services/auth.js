var dojo = require('../lib/dojo');
var UserUtil = require("../util/UserUtil");

var APP_ACCESS_TOKEN = '150801354942182';


exports.checkStatus = function(req, res) {
    var session = req.session;
    if (session.data('user')) {
        res.redirect('/6Degrees/home');
    } else {
        res.redirect('/6Degrees/logon');
    }
};

exports.createUserFromFacebook = function(user, req, res) {
    var cookie = req.getCookie('fbs_' + APP_ACCESS_TOKEN);
    if (cookie) {
        user.fbId = cookie['uid'];
        UserUtil.createFromFacebook(user, cookie['access_token'], function(newUser) {
            console.log("Created FB User");
            UserUtil.retrieveAndCreateFriends(cookie['access_token'], newUser);
            req.session.data('user', newUser._id);
            res.simpleJSON(200, {location : '/6Degrees/home'});
        });
    } else {
        res.simpleJSON(200, {error : 'Please login to Facebook.'});
    }
};

exports.login = function(email, password, req, res) {
    var session = req.session;
    UserUtil.verifyUser(email, password, function(user) {
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
    res.redirect('/6Degrees/logon');
};

/*exports.createUser = function(user, req, res) {
    if (user) {
        var cookie = req.getCookie('fbs_' + APP_ACCESS_TOKEN);
        cookie && (user.fbId = cookie['uid']);
        UserUtil.createUser(dojo.mixin(user, {created : true}), function(newUser) {
            if (newUser.fbId) {
                UserUtil.retrieveAndCreateFriends(cookie['access_token'], newUser);
            }
            req.session.data('user', newUser._id);
            var obj = {
                location : '/6Degrees/home'
            };
            res.simpleJSON(200, obj);
        });
    }

};*/

