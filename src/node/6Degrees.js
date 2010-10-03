var sys = require("sys");
var fb = require("./clients/Facebook").FacebookClient;


var APP_ACCESS_TOKEN = '150801354942182';
var APP_SECRET =  'ad2230fd13e0ada3766afbe146ef633f';
var API_KEY =  '308d7b7179b56300f0cacac44ef5e39b';

exports.findConnection = function(){};
exports.sendMessage = function(){};
exports.getPersonInfo = function(){};
exports.findConnection = function(){};

exports.getFriends = function(uid, req, res, server){
    var client = new fb({cookie : server.getCookie('fbs_' + APP_ACCESS_TOKEN, req)});
    var def = client.getFriends(uid);
    def.addCallback(function(friends){
        var body = friends.join("\n");
        res.writeHead(200, { 'Content-Length': body.length, 'Content-Type': 'text/javascript', charset : 'UTF-8'});
        res.end(body);       
    });
};

exports.checkStatus = function(req, res, server){
    var session = server.getSession(req);
    console.log("Session = ", session);
    var body = {isLoggedIn : (session ? true : false)};
    res.simpleJSON(200, session ? session.id : '', body);
};

exports.logon = function(user, password, req, res, server){
        var session = server.createSession();
        var obj = {
            isLoggedIn : true,
            user : user,
            password : password
        };        
        res.simpleJSON(200, session.id, obj);
};


