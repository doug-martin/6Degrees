var url = require("url");
var dojo = require("../utility/dojo.js");
var sys = require("sys");

module.exports.GetServer = dojo.declare(null, {

    getMap : {},

    constructor : function() {
        this.supportedOps.push("GET");
    },

    _handleRequest : function(req, res) {
        if (req.method === "GET") {
            var urlObj = url.parse(req.url, true);
            var handler = this.getMap[urlObj.pathname];
            if (handler) {
                var session = this.getSession(req);
                if (!handler.session || session) {
                    console.log('session = ', session);
                    req.session = session;
                    var params = this._matchParams(urlObj, handler.params);
                    if (params.length) {
                        return dojo.hitch((handler.scope || this), handler.handler, params);
                    } else {
                        return dojo.hitch((handler.scope || this), handler.handler);
                    }
                }else{
                    this.notAuthorized(req, res);
                }
            } else {
                this.inherited(arguments);
            }
        } else {
            return this.inherited(arguments);
        }
    },

    getRequest : function (path, handler, params, scope) {
        this.getMap[path] = {handler : handler, params : params, scope : scope};
    }
});