var http = require('http');
var dojo = require("../lib/dojo");
var sys = require("sys");
var url = require('url')
var queryString = require('querystring');
var request = require('../lib/node-utils/request/main');

exports.FacebookClient = dojo.declare(null, {

    host : 'graph.facebook.com',

    client : null,

    cookie : null,

    constructor : function(params) {
        dojo.mixin(this, params || {});
        this.client = http.createClient(443, this.host, true);
    },

    _makeRequest : function(url, params, def) {
        var request = this.client.request('GET', url + '?' + queryString.stringify(params, '&', '=', false), {'host': this.host}, {'host': this.host});
        request.on('response', dojo.hitch(this, this._handleResponse, def));
        request.end();
    },

    getFriends : function(uid, access_token) {
        var def = new dojo.Deferred();
        if (access_token && uid) {
            this._makeRequest('/' + uid + '/friends', {'access_token' : access_token}, def);
        } else {
            def.errback();
        }
        return def;
    },

    getInfo : function(uid, access_token) {
        var def = new dojo.Deferred();
        if (access_token && uid) {
            this._makeRequest('/' + uid, {'access_token' : access_token}, def);
        } else {
            def.errback();
        }
        return def;
    },

    getProfilePicture : function(uid, access_token) {
        var def = new dojo.Deferred();        
        if (access_token && uid) {
            var r = this.client.request('GET', '/' + uid + '/picture' + '?' + queryString.stringify({'access_token' : access_token}, '&', '=', false), {'host': this.host}, {'host': this.host});
            r.on('response', dojo.hitch(this, function(res) {
                var location = res.headers['location'];
                if (location) {
                    location = url.parse(location.replace(/q.jpg/, "n.jpg"));
                    var client = http.createClient(location.port || 80, location.hostname, false);
                    var fullpath = location.href.replace(location.protocol + '//' + location.host, '');
                    var request = client.request("GET", fullpath, {host : location.host});
                    request.addListener("response", function (response) {
                        var buffer = '';
                        response.setEncoding('binary');
                        response.addListener("data", function (chunk) {
                            buffer += chunk;
                        });
                        response.addListener("end", function () {
                            def.callback(new Buffer(buffer, 'binary'), 'image/jpeg');
                        });
                    });
                    request.end();
                }else{
                    def.callback(null, null);
                }
            }));
            r.end();
        } else {
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
        response.on('end', function() {
            def.callback(res.join(''));
        });
    }

});