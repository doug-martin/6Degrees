var configuration = require("./loaders/configuration");
var dojo = require("./utility/dojo.js"), queryString = require('querystring');

var http = require("http"), sys = require("sys");

configuration.load(process.argv[2]);

// ---------------------------------------
// Enhancing the HTTP Lib for cookies.
// ---------------------------------------

// summary:
// - Adds getCookie method to the httpRequest object.
// - Adds setCookie and clearCookie methods to the httpResponse object.
// acknowledgements:
// Code based on http://github.com/jed/cookie-node/blob/master/cookie-node.js

function pad(len, str, padder) {
	var padder = padder || "0";
	while (str.length < len) {
		str = padder + str;
	}
	return str;
}

var _writeHeader = http.ServerResponse.prototype.writeHead;

dojo.extend(http.IncomingMessage, {
	// summary:
	// The getCookie method.
	_parseCookies : function() {
		var ret = {}, cookies;

		if (this.headers.cookie && (cookies = this.headers.cookie.split(";"))) {

			for ( var parts, cookieName, cookie; cookies.length && (cookie = cookies.shift());) {
				parts = cookie.split("=");

				cookieName = ("" + parts[0]).replace(/^\s\s*/, '').replace(/\s\s*$/, '');

				ret[cookieName] = ("" + parts[1]).replace(/^\s\s*/, '').replace(/\s\s*$/, '');
			}
		}

		return this.cookies = ret;
	},

	getCookie : function(name) {
		var cookies = this._parseCookies();
		return cookies[name] || null;
	}
});

dojo.extend(http.ServerResponse, {
	// summary:
	// The getCookie method.
	setCookie : function(name, value, options) {
		var cookie = name + "=" + value + ";";

		this.cookies = this.cookies || [];

		options = options || {};

		if (options.expires) {
			var d = new Date(options.expires);
			var wdy = [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ];
			var mon = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];

			cookie += ('expires=' + wdy[d.getUTCDay()] + ', ' + pad(2, d.getUTCDate()) + '-' + mon[d.getUTCMonth()] + '-' + d.getUTCFullYear() + ' ' + pad(2, d.getUTCHours()) + ':'
					+ pad(2, d.getUTCMinutes()) + ':' + pad(2, d.getUTCSeconds()) + ' GMT;');
		}
		if (options.path) {
			cookie += " path=" + options.path + ";";
		}
		if (options.domain) {
			cookie += " domain=" + options.domain + ";";
		}
		if (options.secure) {
			cookie += "; secure";
		}
		if (options.httpOnly) {
			cookie += "; httpOnly";
		}
		this.cookies.push(cookie);
	},

	clearCookie : function(name) {		
		this.setCookie(name, "", {expires : new Date(+new Date - 30 * 24 * 60 * 60 * 1000)});
	},

	simpleText : function(code, body) {
		this.writeHead(code, {
			"Content-Type" : "text/plain",
			"Content-Length" : body.length
		});
		this.end(body);
	},

	simpleJSON : function(code, obj) {
		var body = JSON.stringify(obj);
		this.writeHead(code, {
			"Content-Type" : "text/json",
			"Content-Length" : body.length
		});
		this.end(body);
	},
	
	redirect : function(location){
		var body = "Redirecting to " + location;
		this.writeHead(302, {			
			'Location' :  location,
			'Content-Type': 'text/plain',
			'Content-Length': body.length
		});
		this.end(body);
	},

	writeHead : function(statusCode, headers) {
		if (this.cookies) {
			headers["Set-Cookie"] = this.cookies.join(", ");
		}
		_writeHeader.call(this, statusCode, headers);
	}
});
