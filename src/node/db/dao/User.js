var dojo = require('../../utility/dojo'),
    BaseDAO = require('./_BaseDAO')._BaseDAO,
    Db = require('../../lib/mongodb').Db,
    Server = require('../../lib/mongodb').Server;



exports.UserDAO = dojo.declare(BaseDAO, {

	_collectionName : 'users',
    
    getUser : function(email, callback){    	
    	this.findOne({'email' : email}, callback);
    },
    
    createUser : function(userObj, callback){
    	this.getUser(userObj.email, dojo.hitch(this, function(err, user){
    		if(user){    			
    			callback({message : 'Email already is use!'});
    		}else{
    			this.save(dojo.mixin({}, userObj), callback);
    		}
    	}));    	
    },
    
    verifyUser : function(email, password, callback){
    	this.findOne({"email" : email, "password" : password}, function(error, user){    		
    		callback(user ? true : false);
    	});
    }

});