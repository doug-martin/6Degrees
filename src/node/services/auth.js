var UserDAO = require('../db/dao/User').UserDAO;

var db = new UserDAO();

var verifyUser = function(user){
	var ret = false;
	if(user){
		ret= (user.firstName && user.lastName && user.email && user.dateOfBirth && user.sex); 
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
	db.verifyUser(email, password, function(isUser) {
		var obj;
		if (isUser) {
			session.data('user', email);
			obj = {
				location : '/6Degrees/home'
			};
		} else {
			obj = {
				error : isUser ? null : 'Invalid Username and Password'				
			};
		}
		res.simpleJSON(200, obj);
	});
};

exports.logout = function(req, res) {
	req.session.destroy();
};

exports.createUser = function(user, req, res) {
	if (user) {		
		if (user && verifyUser(user)) {			
			db.createUser(user, function(error) {
				var obj;
				if (error) {
					obj = {
						error : error.message
					};
				} else {
					req.session.data('user', user.email);
					obj = {
						location : '/6Degrees/home'
					};
				}
				res.simpleJSON(200, obj);
			});
		}else{
			var obj = {
					error : 'Invalid user information.'
			};
			res.simpleJSON(200, obj);
		}
	}

};
