var createServer = require("http").createServer;
var readFile = require("fs").readFile;
var sys = require("sys");
var url = require("url");
var dojo = require("../utility/dojo.js");
var queryString = require('querystring');
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
                console.log(sys.inspect(this.supportedOps));
                if (dojo.indexOf(this.supportedOps, req.method) != -1) {
                    var handler = this._handleRequest(req, res);
                    if (handler) {
                        res.simpleText = function (code, body) {
                            res.writeHead(code, { "Content-Type": "text/plain"
                                , "Content-Length": body.length
                            });
                            res.end(body);
                        };
                        res.simpleJSON = function (code, obj) {
                            var body = JSON.stringify(obj);
                            res.writeHead(code, { "Content-Type": "text/json"
                                , "Content-Length": body.length
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
                var val = queryString.unescape(cookie.substring(cookie.indexOf("=")+2), true);
                var parts = val.split("&");
                var c = {};
                for(var i = 0; i < parts.length; i++){
                    var KV = parts[i].split("=");
                    var k = KV[0].trim(), v = KV[1].trim() || '';
                    if (k[0] === '"') {
                        k = k.slice(1);
                    }
                    if (k[k.length-1] === '"') {
                        k = k.slice(0, k.length-1);
                    }
                     if (v[0] === '"') {
                        v = v.slice(1);
                    }
                    if (v[v.length-1] === '"') {
                        v = v.slice(0, v.length-1);
                    }
                    c[ k ] = v;
                }
                cookies[key] = c;
            });
        }
        return (cookies[name] || null);
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

    listen : function (port, host) {
        !this.started && this.startup();
        this.server.listen(port, host);
        sys.puts("Server at http://" + (host || "127.0.0.1") + ":" + port.toString() + "/");
    },

    shutDown : function () {
        this.server.close();
    }
});