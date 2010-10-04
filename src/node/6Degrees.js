var sys = require("sys");
var UserDAO = require('./db/dao/User').UserDAO;
var fb = require("./clients/Facebook").FacebookClient;

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

exports.checkStatus = function(req, res) {
	var session = req.session;
	if (session.data('user')) {
		res.redirect('/6Degrees/home');
	} else {
		res.redirect('/6Degrees/logon');
	}
};

exports.login = function(user, password, req, res) {
	var session = req.session;
	db.verifyUser(user, password, function(isUser) {
		var obj;
		if (isUser) {
			session.data('user', user);
			obj = {
				location : '/6Degrees/home'
			};
		} else {
			obj = {
				error : isUser ? null : 'Invalid Username and Password',
				user : user
			};
		}
		res.simpleJSON(200, obj);
	});
};

exports.logout = function(req, res) {
	req.session.destroy();
};

exports.createUser = function(user, password, req, res) {
	if (user && password) {
		user = user.toLowerCase();
		db.createUser(user, password, function(error) {
			var obj;
			if (error) {
				obj = {
					error : error.message
				};
			} else {
				req.session.data('user', user);
				obj = {
					location : '/6Degrees/home'
				};
			}
			res.simpleJSON(200, obj);
		});
	}

};
