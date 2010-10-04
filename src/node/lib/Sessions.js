/*
 * Based of off miksago node.js-session scripts available at
 * http://github.com/miksago/node.js-sessions
 * */
(function() {
	var sys = require("sys"), dojo = require("../utility/dojo.js");
	var eventsEmitter = require('events').EventEmitter;

	function pad(len, str, padder) {
		var padder = padder || "0";
		while (str.length < len) {
			str = padder + str;
		}
		return str;
	}

	function timestamp(time) {
		var time = time ? new Date(time) : new Date;
		return pad(2, time.getUTCDate()) + "/" + pad(2, time.getMonth()) + "/" + time.getFullYear() + " " + pad(2, time.getHours()) + ":" + pad(2, time.getMinutes()) + ":" + pad(2, time.getSeconds())
				+ ":" + pad(4, time.getMilliseconds());
	}

	sys.log = function() {
		sys.puts("\033[0;37m" + timestamp() + "\033[0m\t" + Array.prototype.join.call(arguments, " ") + "\033[0m ");
	};

	// The Session Manager:

	exports.SessionManager = dojo.declare(eventsEmitter, {

		options : null,

		domain : '',

		path : '/',

		persistent : true,

		lifetime : 86400,

		secure : false,

		httpOnly : false,

		_sessionStore : null,

		constructor : function(options) {
			options && dojo.mixin(this, options);
			this._sessionStore = {};
		},

		create : function(resp) {
			var _sid = this._sid();
			var manager = this;

			var session = {
				sid : _sid,
				expires : Math.floor((+new Date) + this.lifetime * 1000),
				data : dojo.hitch(this, function(sid, key, value) {
					if (value) {
						this.setData(sid, key, value);
					}

					if (key) {
						return this.getData(sid, key);
					} else {
						return this.getData(sid);
					}
				}, _sid),
				destroy : dojo.hitch(this, function(sid, resp) {
					resp.clearCookie("SID");
					this.destroy(sid);
				}, _sid),
				_data : {}
			};

			this._sessionStore[_sid] = session;
			this.emit("create", _sid);

			resp.setCookie("SID", _sid, {
				domain : this.domain,
				path : this.path,
				expires : session.expires,
				secure : this.secure,
				httpOnly : this.httpOnly
			});

			sys.log("\033[0;32m+++ " + _sid + "\tExpires: " + timestamp(session.expires));

			if (!this.timer) {
				this.cleanup();
			}

			return this._sessionStore[_sid];
		},

		lookup : function(req) {
			var sid = req.getCookie("SID");

			if (this._sessionStore[sid]) {
				this._sessionStore[sid].expires = Math.floor((+new Date) + this.lifetime * 1000);
				return this._sessionStore[sid];
			} else {
				return null;
			}
		},

		lookupOrCreate : function(req, resp) {
			var session = this.lookup(req);
			return session ? session : this.create(resp);
		},

		has : function(req) {
			return this.lookup(req) ? true : false;
		},

		get : function(sid) {
			return this._sessionStore[sid];
		},

		destroy : function(sid) {
			this.emit("destroy", sid);
			delete this._sessionStore[sid];
		},

		getData : function(sid, key) {
			var session = this.get(sid);
			session.expires = Math.floor((+new Date) + this.lifetime * 1000);
			if (key) {
				return session._data[key] ? session._data[key] : null;
			} else {
				return session._data;
			}
		},

		setData : function(sid, key, value) {
			sys.log(">>> Set Data: " + sid + "[\033[0;32m" + key + "\033[0;0m] = " + JSON.stringify(value));

			var session = this._sessionStore[sid];
			session._data[key] = value;
			session.expires = Math.floor((+new Date) + this.lifetime * 1000);

			this.emit("change", sid, session._data);
			return session._data[key];
		},

		_sid : function() {
			var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/', // base64
			// alphabet
			ret = '';

			for ( var bits = 24; bits > 0; --bits) {
				ret += chars[0x3F & (Math.floor(Math.random() * 0x100000000))];
			}
			return ret;
		},

		cleanup : function() {
			var sessionExpiration, now = Date.now(), next = Infinity;

			sys.log(">>> Cleaning Up.");
			sys.puts(sys.inspect(this._sessionStore));

			for ( var sid in this._sessionStore) {
				if (Object.prototype.hasOwnProperty.call(this._sessionStore, sid)) {
					sessionExpiration = this._sessionStore[sid].expires;
	

					// Using a Max Difference because timers can be delayed by a
					// few
					// milliseconds.
					if (sessionExpiration - now < 100) {
						sys.log("\033[0;31m--- " + sid);
						this.destroy(sid);
					} else {
						next = next > sessionExpiration ? sessionExpiration : next;
					}
				}
			}

			if (next < Infinity && next >= 0) {
				sys.log(">>> Next Cleanup at: " + timestamp(next));

				var self = this;
				this.timer = setTimeout(function() {
					self.cleanup.apply(self, []);
				}, next - now);

			} else {
				delete this.timer;
				sys.log(">>> No More Cleanups. ");
				sys.puts(sys.inspect(this._sessionStore));
			}
		},

		serialize : function() {
			sys.debug("SessionManager.serialize is unstable.");
			return JSON.stringify(this._sessionStore);
		},

		deserialize : function(string) {
			sys.debug("SessionManager.deserialize is unstable.");
			this._sessionStore = JSON.parse(string);
		}

	});
})();