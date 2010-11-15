require.paths.unshift('../lib/mongoose/mongoose');
var hash = require('../lib/node_hash/lib/hash');
var mongo = require('mongodb');
var mongoose = require('../lib/mongoose/mongoose').Mongoose;



mongoose.model('User', {

    properties: [
        'fbId',
        'dateOfBirth',
        'password',
        'sex',
        {'friends' : []},
        'name',
        'email',
        'verified',
        'created'
    ],        

    setters: {
        password : function(v){
            return hash.md5(v);
        }
    },

    methods : {

        containsFriend : function(id){
            if(id instanceof mongo.ObjectID){
                id = id.toJSON();
            }
            return this.friends.some(function(fid){
                fid = fid.toJSON();
                return fid == id;
            });
        }

    },

    static: {

        verifyUser : function(email, password) {
            return this.find({email : email, password: hash.md5(password)}, true);
        },

        findByEmail : function(email){
            return this.find({email : email}, true);
        },

        findByFbId : function(fbId){            
            return this.find({fbId : fbId}, true);
        }
    }

});


