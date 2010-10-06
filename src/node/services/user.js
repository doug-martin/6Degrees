var dojo = require("../lib/dojo");
var UserDAO = require('../db/dao/User').UserDAO;
var MessagesDAO = require('../db/dao/Messages').MessagesDAO;
var fb = require("../clients/Facebook").FacebookClient;

var APP_ACCESS_TOKEN = '150801354942182';
var APP_SECRET = 'ad2230fd13e0ada3766afbe146ef633f';
var API_KEY = '308d7b7179b56300f0cacac44ef5e39b';

var userDAO = new UserDAO();
var messagesDAO = new MessagesDAO();

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
	var id;
	if(session && (id = session.data('user'))){
        console.log("Retreiving user with id " + id);
		userDAO.getUser(id, function(error, user){
            console.log("User with id ", user);
			if(user){
				var retObject = dojo.mixin({}, user);
				delete retObject.password;
				delete retObject._id;
				res.simpleJSON(200, retObject);
			}else{
                res.simpleJSON(200, {'error' : 'Error retreiving user information'});                
            }
		});
	}
};

exports.getMessages = function(forUid, req, res){
	var session = req.session;
	var id;
	if(session &&(id = session.data('user')) != null){
		messagesDAO.getMessagesForUser(forUid, function(error, messages){
			var posts = messages.posts;
			if(id != forUid){
				posts = posts.filter(function(post){
					return (!post.private || post.fromUid == id);
				}, this);
			}
			res.simpleJSON(posts);
		});
	}
}

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
