var dojo = require("../lib/dojo");
var userUtil = require('../util/UserUtil').UserUtil;
var fb = require("../clients/Facebook").FacebookClient;
var formidable = require('../lib/formidable');
var sys = require('sys');
var fs = require('fs');

var UserUtil = new userUtil;

var APP_ACCESS_TOKEN = '150801354942182';
var APP_SECRET = 'ad2230fd13e0ada3766afbe146ef633f';
var API_KEY = '308d7b7179b56300f0cacac44ef5e39b';
var client = new fb();

exports.findConnection = function(target, req, res) {
    var session = req.session;
    var id;
    if (session && (id = session.data(session.sid, 'user'))) {
        UserUtil.sixDegrees(id, target, function(path) {
            if (path) {
                path = path.map(function(usr) {
                    return {name : usr.name, id : usr.id};
                });
            }
            path = path || {message : 'Path not found'};
            res.simpleJSON(200, path);
        });
    }
};
exports.sendMessage = function(to, message, req, res) {
    var session = req.session;
    var id;
    if (session && (id = session.data(session.sid, 'user'))) {
        UserUtil.addMessage(id, to, message, function(msg) {
            if (msg) {
                res.simpleJSON(200, {message : msg});
            } else {
                res.simpleJSON(200, {error : "User does not exist"});
            }
        })
    }
};

exports.getFriendInfo = function(id, req, res) {
    UserUtil.getUserInfo(id, function(user) {
        if (user) {
            user['locked'] = true;
            res.simpleJSON(200, user);
        } else {
            res.simpleJSON(200, {'error' : 'Error retreiving user information'});
        }
    });

};

exports.getInfo = function(req, res) {
    var session = req.session;
    var id;
    if (session && (id = session.data(session.sid, 'user'))) {
        UserUtil.getUserInfo(id, function(user) {
            if (user) {
                res.simpleJSON(200, user);
            } else {
                res.simpleJSON(200, {'error' : 'Error retreiving user information'});
            }
        });
    }
};


exports.getFriends = function(req, res) {
    var cookie = req.getCookie('fbs_' + APP_ACCESS_TOKEN);
    if (cookie) {        
        var access_token = cookie['access_token'];
        var uid = cookie['uid'];
        var def = client.getFriends(uid, access_token);
        def.addCallback(dojo.hitch(res, res.simpleJSON, 200));
    }
};

exports.searchForUsers = function(name, req, res) {
    UserUtil.searchUsers(name, function(users) {
        res.simpleJSON(200, users);
    });
};


