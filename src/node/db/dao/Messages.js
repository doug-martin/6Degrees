var dojo = require('../../utility/dojo'), BaseDAO = require('./_BaseDAO')._BaseDAO, Db = require('../../lib/mongodb').Db, Server = require('../../lib/mongodb').Server;

exports.MessagesDAO = dojo.declare(BaseDAO, {

	_collectionName : 'messages',

	getMessagesForUser : function(id, callback) {
		this.findOne({
			'userId' : id
		}, function(error, messages) {
			if (!messages) {
				this.save({
					userId : id,
					posts : [ {
						from : '6Degrees',
						message : 'Welcome to 6Degrees',
						private : false,
						fromUid : 0,
						date : new Date().toUTCString()
					} ]
				}, callback);
			} else {
				callback(error, messages);
			}
		});
	},

	addMessage : function(message, callback) {
		this.update(message.toUid, {
			'$push' : {
				posts : dojo.mixin(message, {
					date : new Date().toUTCString()
				})
			}
		}, callback);
	}

});