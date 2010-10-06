var url = require("url");
var dojo = require("../../dojo");

module.exports.GetServer = dojo.declare(null, {

    putMap : {},

    constructor : function() {
        this.supportedOps.push("PUT");
    },

    _handleRequest : function(req, res) {
        if (req.method === "PUT") {
            var url = url.parse(req.url, true);
            var handler = this.putMap[url.pathname];
            return handler.handler.apply(handler.scope || null, this._matchParams(url, handler.params));
        } else {
            return this.inherited(arguments);
        }
    },

    putRequest : function (path, handler, params, scope) {
        this.putMap[path] = {handler : handler, params : params, scope : scope};
    }
});
