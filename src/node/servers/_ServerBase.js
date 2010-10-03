var createServer = require("http").createServer,
        http = require("http"),
        readFile = require("fs").readFile,
        sys = require("sys"),
        url = require("url"),
        dojo = require("../utility/dojo.js"),
        queryString = require('querystring');
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
            this.server = createServer(dojo.hitch(this, function(req, res) {
                if (dojo.indexOf(this.supportedOps, req.method) != -1) {
                    var handler = this._handleRequest(req, res);
                    if (handler) {
                        res.simpleText = function (code, cookie, body) {
                            res.writeHead(code, {
                                "Content-Type": "text/plain",
                                "Content-Length": body.length,
                                "Set-Cookie" : cookie || ''
                            });
                            res.end(body);
                        };
                        res.simpleJSON = function (code, cookie, obj) {
                            var body = JSON.stringify(obj);
                            res.writeHead(code, { "Content-Type": "text/json",
                                "Content-Length": body.length,
                                "Set-Cookie" : cookie || ''
                            });
                            res.end(body);
                        };
                        handler(req, res, this);
                    } else {
                        console.log(req.method + " is not supported for path : " + url.parse(req.url).pathname);
                        this.notImplemented(req, res);
                    }
                } else {
                    console.log(req.method + " is not supported");
                    this.notImplemented(req, res);
                }
            }));
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
        var cookies = {};
        var hCookies = req.headers.cookie;
        if (hCookies) {
            hCookies.split(';').forEach(function(cookie) {
                var key = cookie.substring(0, cookie.indexOf("="));
                var val = queryString.unescape(cookie.substring(cookie.indexOf("=") + 2), true);
                var parts = val.split("&");
                var c = {};
                for (var i = 0; i < parts.length; i++) {
                    var KV = parts[i].split("=");
                    var k = KV[0], v = KV[1];
                    k && k.trim();
                    v && v.trim() || '';
                    if (k[0] === '"') {
                        k = k.slice(1);
                    }
                    if (k[k.length - 1] === '"') {
                        k = k.slice(0, k.length - 1);
                    }
                    if (v) {
                        if (v[0] === '"') {
                            v = v.slice(1);
                        }
                        if (v[v.length - 1] === '"') {
                            v = v.slice(0, v.length - 1);
                        }
                        c[ k ] = v;
                    } else {
                        c = k;
                    }
                }
                cookies[key] = c;
            });
        }
        console.log('Cookie width name ' + name + " : ", cookies[name]);
        return (cookies[name] || null);
    },

    removeCookie : function(res) {

    },

    //Stub for implementation.
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

    listen : function (port, host) {
        !this.started && this.startup();
        this.server.listen(port, host);
        sys.puts("Server at http://" + (host || "127.0.0.1") + ":" + port.toString() + "/");
    },

    shutDown : function () {
        this.server.close();
    }
});

dojo.extend(http.ServerResponse, {
    getCookie : function() {

    },

    setCookie : function() {

    },

    clearCookie : function() {

    }
});

process.mixin(http.IncomingMessage.prototype, {
    // summary:
    // The getCookie method.
    _parseCookies: function() {
        var ret = {}, cookies;

        if (this.headers.cookie && (cookies = this.headers.cookie.split(";"))) {

            for (var parts, cookieName, cookie; cookies.length && (cookie = cookies.shift());) {
                parts = cookie.split("=");

                cookieName = ("" + parts[0]).replace(/^\s\s*/, '').replace(/\s\s*$/, '');

                ret[cookieName] = ("" + parts[1]).replace(/^\s\s*/, '').replace(/\s\s*$/, '');
            }
        }

        return this.cookies = ret;
    },

    getCookie: function(name) {
        var cookies = this._parseCookies();

        return cookies[name] || null;
    }
});

process.mixin(http.ServerResponse.prototype, {
    // summary:
    // The getCookie method.
    setCookie: function(name, value, options) {
        var cookie = name + "=" + value + ";";

        this.cookies = this.cookies || [];

        options = options || {};

        if (options.expires) {
            var d = new Date(this.expires);
            var wdy = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            var mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

            cookie += ('expires=' + wdy[d.getUTCDay()] + ', ' + pad(2, d.getUTCDate()) + '-' + mon[d.getUTCMonth()] + '-' + d.getUTCFullYear() + ' ' + pad(2, d.getUTCHours()) + ':' + pad(2, d.getUTCMinutes()) + ':' + pad(2, d.getUTCSeconds()) + ' GMT');
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

    clearCookie: function(name, options) {
        options.expires = new Date(+new Date - 30 * 24 * 60 * 60 * 1000);
        this.setCookie(name, "", options);
    }
});

