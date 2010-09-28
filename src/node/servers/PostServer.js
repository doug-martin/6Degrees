var url = require("url");
var dojo = require("../utility/dojo.js");

module.exports.PostServer = dojo.declare(null, {

    postMap : {},

    constructor : function() {
        this.supportedOps.push("POST");
    },

    _handleRequest : function(req, res) {
        if (req.method === "POST") {
            var url = url.parse(req.url, true);
            var handler = this.postMap[url.pathname];
            return handler.handler.apply(handler.scope || null, this._matchParams(url, handler.params));
        } else {
            return this.inherited(arguments);
        }
    },

    postRequest : function (path, handler, params) {
        this.postMap[path] = {handler : handler, params : params};
    }
});