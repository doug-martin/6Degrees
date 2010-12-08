var dojo = require("../dojo"),
        queryString = require('querystring'),
        http = require("http"),
        sys = require("sys"),
        url = require("url"),
        path = require("path"),
        readFile = require("fs").readFile;

var modules = {};

function resolveMethods(methodObj, httpMethod, server) {
    console.log("loading " + httpMethod + " methods");
    var methods = methodObj.methods || [];
    for (var i in methods) {
        var method = methods[i];
        console.log("loading method", sys.inspect(method));
        var handlerClass = method.handler, operations = method.operations;
        var handler;
        if ((handler = modules[handler]) == null) {
            modules[handlerClass] = (handler = require(handlerClass));
        }
        for (var j in operations) {
            var operation = operations[j];
            var func = operation.method;
            if (handler[func]) {
                var path = operation.path != null && operation.path != undefined ? operation.path : "/" + func;
                var params = operation.params || "";
                var session = operation.session || false;
                console.log("adding method at path " + server.basePath + path);
                server[httpMethod.toLowerCase() + "Request"](server.basePath + path, handler[func], session, params, handler);
            }else{
                throw new Error("Cannot add method " + func);
            }
        }
    }
}

function parseConfiguration(serverArr) {
    for (var i in serverArr) {
        var json = serverArr[i];
        var port = json.port || "8080";
        var host = json.host || "localhost";
        var path = json.path || "/";
        var GET = json.GET || null;
        var POST = json.POST || null;
        var PUT = json.PUT || null;
        var DELETE = json.DELETE || null;
        var welcomeFiles = json.welcomeFiles;
        var errorFiles = json.errorFiles;
        var serverClass = json.server;
        var server = require(serverClass)[serverClass.substring(serverClass.lastIndexOf("/") + 1)];
        server = new server({basePath : path});
        if (GET) {
            var dirs = GET.dirs || null;
            if (dirs) {
                dojo.forEach(dirs, server.addDirectoryGet, server);
            }
            resolveMethods(GET, "GET", server);
        }
        if (POST) {
            resolveMethods(POST, "POST", server);
        }
        if (PUT) {
            resolveMethods(PUT, "PUT", server);
        }
        if (DELETE) {
            resolveMethods(DELETE, "DELETE", server);
        }
        if (welcomeFiles) {
            console.log("loading welcomeFiles methods");
            dojo.forEach(welcomeFiles, server.addFileGet, server);
        }
        if (errorFiles) {
            console.log("loading errorFiles methods");
            dojo.forEach(errorFiles, server.addErrorFile, server);
        }
        console.log("starting server");
        server.listen(port, host);
    }
}

exports.load = function(file) {
    var json;
    console.log("Reading configuration at : ", file);
    readFile(file, function (err, data) {
        if (err) {
            console.log(sys.inspect(err), process.cwd());
            console.log("Error loading configuration file : " + filename);
        } else {
            parseConfiguration(JSON.parse(data));
        }
    });
};

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

    _parseCookies : function() {
        var cookies = {};
        var hCookies = this.headers.cookie;
        if (hCookies) {
            hCookies.split(';').forEach(function(cookie) {
                var key = cookie.substring(0, cookie.indexOf("="));
                var val = queryString.unescape(cookie.substring(cookie.indexOf("=") + 1));
                key = key.replace(/^\s+/, '').replace(/\s+$/, '');
                val = val.replace(/^\s+/, '').replace(/\s+$/, '');
                var parts = val.split("&");
                var c = {};
                if (parts.length > 1) {
                    for (var i = 0; i < parts.length; i++) {
                        var KV = parts[i].split("=");
                        var k = KV[0].replace(/^\s\s\*/, '').replace(/\s\s*$/, '').replace('"', ''),
                                v = KV[1].replace(/^\s\s\*/, '').replace(/\s\s*$/, '').replace('"', '');
                        if (v) {
                            c[ k ] = v;
                        } else {
                            c = k;
                        }
                    }
                } else {
                    c = val;
                }
                cookies[key] = c;
            });
        }
        return (this.cookies = cookies);
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

    simpleHTML : function(code, body) {
        this.writeHead(code, {
            "Content-Type" : "text/html",
            "Content-Length" : body.length
        });
        this.end(body);
    },

    image : function(body, mime){
        this.writeHead(200, {
            'Content-Type': mime,
            'Content-Length': body.length
        });        
        this.end(body);
    },

    redirect : function(location) {
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
