var createServer = require("http").createServer, http = require("http"), readFile = require("fs").readFile, sys = require("sys"), url = require("url"), dojo = require("../../dojo");
DEBUG = false;

var serverBase = exports;

module.exports._ServerBase = dojo.declare(null, {

	NOT_FOUND : "Not Found\n",

	NOT_IMPLMENTED : "{method} not implemented for {path}\n",

	server : null,

	started : false,

	basePath : '/',

	supportedOps : null,

	constructor : function(params) {
		this.supportedOps = [];
		dojo.mixin(this, params);
	},

	startup : function() {
		if (!this.started) {
			this.server = createServer(dojo.hitch(this, this._requestHandler));
			this.started = true;
		}
	},

	_requestHandler : function(req, res) {
		if (dojo.indexOf(this.supportedOps, req.method) != -1) {
			var handler = this._handleRequest(req, res);
			if (handler) {
				handler(req, res, this);
			} else {
				this.notImplemented(req, res);
			}
		} else {
			this.notImplemented(req, res);
		}
	},

	_matchParams : function(urlObj, params) {
		var ret = [];
		console.log(urlObj);
		if (params && params != "") {
			var query = urlObj.query || "";
			ret = dojo.map((params || "").split(","), function(name) {
				return query[name] || null
			});
		}
		return ret;
	},

	getCookie : function(name, req) {

	},

	removeCookie : function(res) {

	},

	// Stub for implementation.
	_handleRequest : function(req, res) {
	},

	notFound : function(req, res) {
		var file = this.getErrorFile(404);
		file(req, res);
	},

	notImplemented : function(req, res) {
		var file = this.getErrorFile(405);
		file(req, res);
	},

	notAuhthorized : function(req, res) {
		var file = this.getErrorFile(401);
		file(req, res);
	},

	listen : function(port, host) {
		!this.started && this.startup();
		this.server.listen(port, host);
		sys.puts("Server at http://" + (host || "127.0.0.1") + ":" + port.toString() + "/");
	},

	shutDown : function() {
		this.server.close();
	}
});

