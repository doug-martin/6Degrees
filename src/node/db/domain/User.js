var dojo = require('../../lib/dojo');

exports.User = dojo.declare(null, {

    _id : null,

    fbId : null,

    dateOfBirth : null,

    password : null,

    sex : null,

    friends : null,

    name : '',

    email : null,

    verified : false,

    created : false,

    constructor : function(user) {
        if (user) {
            this._id = user._id || null;
            this.fbId = user.fbId || null;
            this.dateOfBirth = user.dateOfBirth || null;
            this.sex = user.sex || null;
            this.friends = user.friends || [];
            this.password = user.password || '';
            this.email = user.email;
            var name = user.name || '';
            if (user.firstName && user.lastName) {
                name =  user.firstName + ' ' + user.lastName;
            }
            this.name = name;
            this.created = user.created || false;
        }
    },

    toJSON : function() {
        return {
            "_id" : this.id,
            "fbId" : this.fbId,
            "dateOfBirth" : this.dateOfBirth,
            "sex" : this.sex,
            "friends" : this.friends,
            "name" : this.name,
            "created" : this.created,
            "verified" : this.verified,
            "email" : this.email
        };
    }

});