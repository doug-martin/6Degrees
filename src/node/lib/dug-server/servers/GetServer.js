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
                    var params = this._matchParams(urlObj, handler.params);
                    if (params.length) {
                        return dojo.hitch((handler.scope || this), handler.handler, params);
                    } else {
                        return dojo.hitch((handler.scope || this), handler.handler);
                    }
                }else{
                    res.redirect(this.basePath);
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