var dojo = require("../utility/dojo.js");
var UserDAO = require('../db/dao/User').UserDAO;
var fb = require("../clients/Facebook").FacebookClient;

var APP_ACCESS_TOKEN = '150801354942182';
var APP_SECRET = 'ad2230fd13e0ada3766afbe146ef633f';
var API_KEY = '308d7b7179b56300f0cacac44ef5e39b';

var db = new UserDAO();

exports.findConnection = function() {
};
exports.sendMessage = function() {
};
exports.getPersonInfo = function() {
};
exports.findConnection = function() {
};

exports.getInfo = function(req, res){
	var session = req.session;
	var email;
	if(session && (email = session.data('user'))){
		db.getUser(email, function(error, user){
			if(user){
				var retObject = dojo.mixin({}, user);
				delete retObject.password;
				res.simpleJSON(200, retObject);
			}
		});
	}
};

exports.getFriends = function(uid, req, res, server) {
	var client = new fb({
		cookie : server.getCookie('fbs_' + APP_ACCESS_TOKEN, req)
	});
	var def = client.getFriends(uid);
	def.addCallback(function(friends) {
		var body = friends.join("\n");
		res.writeHead(200, {
			'Content-Length' : body.length,
			'Content-Type' : 'text/javascript',
			charset : 'UTF-8'
		});
		res.end(body);
	});
};
