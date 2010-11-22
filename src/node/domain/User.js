require.paths.unshift('../lib/mongoose/mongoose');
var hash = require('../lib/node_hash/lib/hash');
var dojo = require('../lib/dojo');
var mongo = require('mongodb');
var mongoose = require('../lib/mongoose/mongoose').Mongoose;



mongoose.model('User', {

    properties: [
        'fbId',
        'dateOfBirth',
        'password',
        'sex',
        {'friends' : []},
        {'messages' : [['from', 'message', 'time', '_id']]},
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
            var newId;
            if(id instanceof mongo.ObjectID){
                newId = id.toJSON();
            }else{
                newId = id;
            }
            return this.friends.some(function(fid){
                fid = fid.toJSON();
                return fid == newId;
            });
        },

        addFriend : function(friendId){
          if(!this.containsFriend(friendId)){
              this.friends.push(friendId);
          }
        },

        addMessage : function(message){
            if(message && message.from)
            {
                this.messages.push(dojo.mixin(message, {_id : new mongo.ObjectID(), time : new Date()}));
            }
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


