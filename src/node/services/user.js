var dojo = require("../lib/dojo");
var UserUtil = require('../util/UserUtil');
var fb = require("../clients/Facebook").FacebookClient;
var formidable = require('../lib/formidable');
var sys = require('sys');
var fs = require('fs');

var APP_ACCESS_TOKEN = '150801354942182';
var APP_SECRET = 'ad2230fd13e0ada3766afbe146ef633f';
var API_KEY = '308d7b7179b56300f0cacac44ef5e39b';
var client = new fb();

exports.findConnection = function(target, req, res) {
    console.log('Hit it');
    var session = req.session;
    var id;
    if (session && (id = session.data('user'))) {
        console.log('Searching for ' + target);
        UserUtil.sixDegrees(id, target, function(path) {
            console.log('found path');
            if(path){
                path = path.map(function(usr){return {name : usr.name, id : usr.id};});
            }
            path = path || {message : 'Path not found'};
            res.simpleJSON(200, path);
        });
    }
};
exports.sendMessage = function() {
};
exports.getPersonInfo = function() {
};

exports.getInfo = function(req, res) {
    var session = req.session;
    var id;
    if (session && (id = session.data('user'))) {
        console.log("Retreiving user with id " + id);
        UserUtil.getUserInfo(id, function(user) {
            if (user) {
                res.simpleJSON(200, user);
            } else {
                res.simpleJSON(200, {'error' : 'Error retreiving user information'});
            }
        });
    }
};

exports.getMessages = function(forUid, req, res) {
    var session = req.session;
    var id;
    if (session && (id = session.data('user')) != null) {
        messagesDAO.getMessagesForUser(forUid, function(error, messages) {
            var posts = messages.posts;
            if (id != forUid) {
                posts = posts.filter(function(post) {
                    return (!post.private || post.fromUid == id);
                }, this);
            }
            res.simpleJSON(posts);
        });
    }
};

exports.getFriends = function(req, res) {
    var cookie = req.getCookie('fbs_' + APP_ACCESS_TOKEN);
    if (cookie) {
        console.log(cookie);
        var access_token = cookie['access_token'];
        var uid = cookie['uid'];
        var def = client.getFriends(uid, access_token);
        def.addCallback(dojo.hitch(res, res.simpleJSON, 200));
    }
};

exports.searchForUsers = function(name, req, res){
    UserUtil.searchUsers(name, function(users){
        res.simpleJSON(200, users);
    });
};


