var sys = require("sys");
var url = require("url");
var dojo = require("../utility/dojo.js");
var queryString = require('querystring');
DEBUG = false;

exports._SessionServer = dojo.declare(null, {

    session : null,

    constructor : function() {
        this.session = {};
    },

    createSession : function(res) {
        var nId = this._getNodeSessionId();
        var session = this.session[nId] = {
            id : "nodeSessionId=" + nId,
            expires : (new Date(options.expires)).toUTCString()
        };
        return session;
    },

    getSession : function(req, res) {
        var cookie = this.getCookie('nodeSessionId', req) || '';
        if(cookie && !this.session[cookie]){

        }
        return this.session[cookie] || null;
    },

    addToSession : function(sessionId, key, value) {
        var session = this.session[sessionId] || null;
        if(session){
            session[key] = value;
        }
    },  

    _getNodeSessionId : function() {
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/', // base64 alphabet
                ret = '';
        for (var bits = 24; bits > 0; --bits) {
            ret += chars[0x3F & (Math.floor(Math.random() * 0x100000000))];
        }
        return ret;
    }

});
