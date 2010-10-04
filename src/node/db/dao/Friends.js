var dojo = require('../../utility/dojo'),
    BaseDAO = require('_BaseDAO'),
    Db = require('../lib/mongodb').Db,
    Server = require('../lib/mongodb').Server;

exports.Friends = dojo.declare(BaseDAO, {

    collection : 'friends'

});