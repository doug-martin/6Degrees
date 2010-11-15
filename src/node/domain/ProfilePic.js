require.paths.unshift('../lib/mongoose/mongoose');
var hash = require('../lib/node_hash/lib/hash');
var mongoose = require('../lib/mongoose/mongoose').Mongoose;
var mongo = require('mongodb');



mongoose.model('ProfilePicture', {

    properties: [
      'data',
      'user',
      'mime'
    ],

    cast : {
        data : mongo.Binary,
        user : mongo.ObjectID,
        mime : String
    },

    indexes : [[{'user' : 1}, {unique : true}]]

});


