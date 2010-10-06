var http = require('http');
var dojo = require("../lib/dojo");
var sys = require("sys");
var queryString = require('querystring');

exports.FacebookClient = dojo.declare(null, {

    host : 'api.facebook.com',

    client : null,

    cookie : null,

    constructor : function(params){
        dojo.mixin(this, params || {});
        this.client = http.createClient(443, this.host, true);
    },

    getFriends : function(uid) {
        var def = new dojo.Deferred();
        console.log("Finding friends..");
        if (this.cookie) {
            var req = {
                 'format' : 'json',
                'access_token' : this.cookie['access_token'],
                'uid' : uid
            };
             console.log('/method/friends.get?'+queryString.stringify(req, '&', '=', false));
            var request = this.client.request('GET', '/method/friends.get?' + queryString.stringify(req, '&', '=', false), {'host': this.host});
            request.on('response', dojo.hitch(this, this._handleResponse, def));
            request.end();            
        }else{
             console.log("No cookie..");
            def.errback();
        }
        return def;
    },

    _handleResponse : function(def, response) {                 
        response.setEncoding('utf8');
        var res = [];
        response.on('data', function (chunk) {
            res.push(chunk);
        });
        response.on('end', function(){
           def.callback(res);
        });
    }

});