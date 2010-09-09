var createServer = require("http").createServer;
var readFile = require("fs").readFile;
var sys = require("sys");
var url = require("url");
var dojo = require("./utility/dojo.js");
DEBUG = false;

var serverBase = exports;

exports._ServerBase = dojo.declare(null, {

    NOT_FOUND : "Not Found\n",

    getMap : {},

    server : null,

    started : false,

    startup : function() {
        if (!this.started) {
            this.server = createServer(dojo.hitch(this, function (req, res) {
                if (req.method === "GET" || req.method === "HEAD") {
                    var handler = this.getMap[url.parse(req.url).pathname] || dojo.hitch(this, this.notFound);
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

                    handler(req, res);
                }
            }));
        }
    },

    notFound : function(req, res) {
        console.log("This = " + sys.inspect(this));
        res.writeHead(404, {
            "Content-Type": "text/plain",
            "Content-Length": this.NOT_FOUND.length
        });
        res.end(this.NOT_FOUND);
    },

    get : function (path, handler) {
        this.getMap[path] = handler;
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