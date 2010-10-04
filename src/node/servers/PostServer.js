var url = require("url");
var dojo = require("../utility/dojo.js");

module.exports.PostServer = dojo.declare(null, {    

    constructor : function() {
        this.supportedOps.push("POST");
        this.postMap = {};
    },

    _handleRequest : function(req, res) {
        if (req.method === "POST") {
            var urlObj = url.parse(req.url, true);
            var handler = this.postMap[urlObj.pathname];
            if (handler) {
                var session = req.session;
                if (!handler.session || session.data('user')) {                    
                    return dojo.hitch(this, '_postRequestHandler', handler);
                }else{
                    this.notAuthorized(req, res);F
                }
            }
            //return handler.handler.apply(handler.scope || null, this._matchPostParams(req, handler.params));
        } else {
            return this.inherited(arguments);
        }
    },

    postRequest : function (path, handler, params) {
        this.postMap[path] = {handler : handler, params : params};
    },

    _postRequestHandler : function(handler, req, res, server) {
        req.setEncoding('utf8');
        var params = "";
        req.on('data', function(data) {
            params += data;
        });
        req.on('end', function() {
            var data = JSON.parse(params);
            params = handler.params;
            var args = dojo.map((params || "").split(","), function(name) {
                return data[name] || null;
            });
            args.push(req, res, server);
            handler.handler.apply(handler.scope || null, args);
        });
    }
});