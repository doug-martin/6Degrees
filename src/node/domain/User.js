require.paths.unshift('../lib/mongoose');
var hash = require('../lib/node_hash/lib/hash');
var mongoose = require('mongoose').Mongoose;



mongoose.model('User', {

    properties: [
        'fbId',
        'dateOfBirth',
        'password',
        'sex',
        {'friends' : []},
        'first',
        'last',
        'email',
        'verified',
        'created',
        'updatedAt'
    ],

    cast: {
        age: Number
    },

    indexes: ['first', 'emailAddress', 'password'],

    setters: {
        first: function(first) {
            return this.first.capitalize();
        },
        last : function(last) {
            return this.last.capitalize();
        },
        password : function(password){
            return hash.md5(password);
        }
    },

    getters: {
        fullName: function() {
            return this.first + ' ' + this.last
        }
    },

    methods: {
        save: function(fn) {
            this.updatedAt = new Date();
            this.__super__(fn);
        }
    },

    static: {
        verifyUser : function(email, password) {
            return this.find({email : email, password: hash.md5(password)});
        }
    }

});


