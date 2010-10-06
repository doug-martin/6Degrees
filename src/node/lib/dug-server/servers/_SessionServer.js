var sys = require("sys");
var url = require("url");
var dojo = require("../../dojo");
var queryString = require('querystring');
var SessionManager = require('../util/Sessions').SessionManager;
DEBUG = false;

exports._SessionServer = dojo.declare(null, {

    session : null,
    
    options : null,

    constructor : function(options) {    	
        this.session = new SessionManager();
    },

    
    getOrCreateSession : function(req, res) {
    	return this.session.lookupOrCreate(req, res);
    },
    
    _requestHandler : function(req, res){
    	if(dojo.indexOf(this.supportedOps, req.method) != -1) {
    		req.session = this.getOrCreateSession(req, res);
    		this.inherited(arguments, [req, res]);
    	}
    }
});
