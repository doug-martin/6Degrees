var url = require("url");
var dojo = require("../utility/dojo.js");

module.exports.GetServer = dojo.declare(null, {

    deleteMap : {},

    constructor : function() {
        this.supportedOps.push("DELETE");
    },

    _handleRequest : function(req, res) {
        if (req.method === "DELETE") {
            var url = url.parse(req.url, true);
            var handler = this.deleteMap[url.pathname];
            return handler.handler.apply(handler.scope || null, this._matchParams(url, handler.params));
        } else {
            return this.inherited(arguments);
        }
    },

    deleteRequest : function (path, handler, params, scope) {
        this.deleteMap[path] = {handler : handler, params : params, scope : scope};
    }
});
