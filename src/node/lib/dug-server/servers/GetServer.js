var url = require("url");
var dojo = require("../../dojo");
var sys = require("sys");

module.exports.GetServer = dojo.declare(null, {

    constructor : function() {
        this.supportedOps.push("GET");
        this.getMap = {};
    },

    _handleRequest : function(req, res) {
        if (req.method === "GET") {
            var urlObj = url.parse(req.url, true);
            var handler = this.getMap[urlObj.pathname];
            if (handler) {
                var session = req.session;
                if (!handler.session || session.data('user')) {
                    console.log("Session : ", handler.session);
                    var params = this._matchParams(urlObj, handler.params);
                    var _this = this;
                    var f = this._hitchArgs((handler.scope || _this), handler.handler, params);
                    return function() {
                        return f.apply((handler.scope || _this), arguments || []);
                    };
                } else {
                    res.redirect(this.basePath);
                }
            } else {
                this.inherited(arguments);
            }
        } else {
            return this.inherited(arguments);
        }
    },

    _hitchArgs : function(scope, f, pre) {
        return function() {
            // arrayify arguments
            var args = dojo._toArray(arguments);
            // locate our method
            // invoke with collected args
            return f && f.apply(scope || this, pre.concat(args)); // mixed
        } // Function
    },

    getRequest : function (path, handler, session,  params, scope) {
        this.getMap[path] = {handler : handler, params : params, session : session, scope : scope};
    }
});