var dojo = require('../../utility/dojo'),
    BaseDAO = require('./_BaseDAO')._BaseDAO,
    Db = require('../../lib/mongodb').Db,
    Server = require('../../lib/mongodb').Server;



exports.UserDAO = dojo.declare(BaseDAO, {

	_collectionName : 'users',
    
    getUser : function(id, callback){
    	this.findOne({'_id' : id}, callback);
    },
    
    createUser : function(userObj, callback){
    	this.findOne({'email' : userObj.email}, dojo.hitch(this, function(err, user){
    		if(user){    			
    			callback({message : 'Email already is use!'});
    		}else{
    			this.save(dojo.mixin({}, userObj), callback);
    		}
    	}));    	
    },
    
    verifyUser : function(email, password, callback){
    	this.findOne({"email" : email, "password" : password}, callback);
    }

});