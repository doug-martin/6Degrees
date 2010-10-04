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
	req.session.destroy();
};

exports.createUser = function(user, req, res) {
	if (user) {		
		if (user && verifyUser(user)) {			
			db.createUser(user, function(error, newUser) {
				var obj;
				if (error) {
					obj = {
						error : error.message
					};
				} else {
					req.session.data('user', newUser._id);
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
