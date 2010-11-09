var http = require('http');
var dojo = require("../lib/dojo");
var sys = require("sys");
var queryString = require('querystring');

exports.FacebookClient = dojo.declare(null, {

    host : 'graph.facebook.com',

    client : null,

    cookie : null,

    constructor : function(params){
        dojo.mixin(this, params || {});             
        this.client = http.createClient(443, this.host, true);
    },

     _makeRequest : function(url, params, def){
       console.log(url + '?' +queryString.stringify(params, '&', '=', false));
       var request = this.client.request('GET', url + '?' + queryString.stringify(params, '&', '=', false), {'host': this.host} , {'host': this.host});
       request.on('response', dojo.hitch(this, this._handleResponse, def));
       request.end();
    },

    getFriends : function(uid, access_token) {
        var def = new dojo.Deferred();
        console.log("Finding friends..");
        if (access_token && uid) {
            this._makeRequest('/' + uid + '/friends', {'access_token' : access_token}, def);
        }else{
            def.errback();
        }
        return def;
    },

    getInfo : function(uid, access_token) {
           var def = new dojo.Deferred();
           console.log("Finding user info..");
           if (access_token && uid) {              
               this._makeRequest('/' + uid, {'access_token' : access_token}, def);
           }else{
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
           def.callback(res.join(''));
        });
    }

});