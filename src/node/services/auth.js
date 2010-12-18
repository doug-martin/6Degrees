var dojo = require('../lib/dojo');
var userUtil = require("../util/UserUtil").UserUtil;

var UserUtil = new userUtil();

var APP_ACCESS_TOKEN = '150801354942182';


exports.checkStatus = function(req, res) {
    var session = req.session;
    if (session.data(session.sid, 'user')) {
        res.redirect('/6Degrees/home');
    } else {
        res.redirect('/6Degrees/logon');
    }
};

exports.createUserFromFacebook = function(user, req, res) {
    console.log("hit it");
    var cookie = req.getCookie('fbs_' + APP_ACCESS_TOKEN);
    if (cookie) {
        user.fbId = cookie['uid'];
        UserUtil.createFromFacebook(user, cookie['access_token'], function(newUser) {            
            UserUtil.retrieveAndCreateFriends(cookie['access_token'], newUser);
            var session = req.session;
            session.data(session.sid, 'user', newUser._id);
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
            session.data(session.sid, 'user', user._id);
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


