dojo.provide('degrees.Logon');

dojo.require('dijit._Widget');
dojo.require('dijit._Templated');
dojo.require('dijit.form.Form');
dojo.require('dijit.form.ValidationTextBox');
dojo.require('dijit.form.Button');
dojo.require('dojox.form.PasswordValidator');
dojo.require("dijit.form.DateTextBox");
dojo.require("dijit.form.Select"); 
dojo.require('dojo.fx');
dojo.require("dojox.validate");

dojo.declare('degrees.Logon', [ dijit._Widget, dijit._Templated ], {

	widgetsInTemplate : true,

	templateString : dojo.cache('degrees', 'templates/Logon.html'),

	message : '',

	attributeMap : dojo.delegate(dijit._Widget.prototype.attributeMap, {
		message : [{
			node : 'logonMessageNode',
			type : 'innerHTML'
		},{
			node : 'createMessageNode',
			type : 'innerHTML'
		},]
	}),

	constructor : function() {
		this.userService = new degrees.Service();
		var date = new Date();
		this.today = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + 1;        

	},

	_showCreate : function() {
        FB.init({appId: '150801354942182', status: true, cookie: true, xfbml: true});
        FB.Event.subscribe('auth.sessionChange', function(response) {
            if (response.session) {
                alert('Logged In');
            } else {
               alert("Error logging in");
            }
          });

		this.attr('message', '');
		var createPane = this.createPane, logonPane = this.logonPane;
		var anim1 = dojo.fadeOut({
			node : logonPane
		});
		var anim2 = dojo.fadeIn({
			node : createPane
		});
		var handle = this.connect(anim1, 'onEnd', function() {
			this.disconnect(handle);
			dojo.removeClass(createPane, 'dijitHidden');
			dojo.addClass(logonPane, 'dijitHidden');
			dojo.style(createPane, {
				opacity : 0,
				display : ''
			});
		});
		dojo.fx.chain([ anim1, anim2 ]).play();

	},

	_checkPasswords : function() {
		if (this.validate.attr('value') != this.password.attr('value')) {
			this.validate.state = 'Error';
			this.validate._setStateClass();
			this.validate.displayMessage("Password does not match!");
			return false;
		}
		return true;
	},

	_checkEmail : function() {
		if (this.emailValidate.attr('value') != this.email.attr('value')) {
			this.emailValidate.state = 'Error';
			this.emailValidate._setStateClass();
			this.emailValidate.displayMessage("Email does not match!");
			return false;
		}
		return true;
	},

	_onSubmit : function(e) {
		e.preventDefault();
		if (this.form.validate()) {
			var vals = this.form.attr('value');
			this.userService.logon(vals).addCallback(dojo.hitch(this, this._checkResponse));
			this.onSubmit(vals);
		}
	},

	_onCreateSubmit : function(e) {
		e.preventDefault();
		if (this.createForm.validate() && this._checkPasswords() && this._checkEmail()) {
			this._checkPasswords();
			var vals = this.createForm.attr('value');
			vals.dateOfBirth = vals.dateOfBirth.toUTCString();
			this.userService.createUser(dojo.mixin({}, {user : vals})).addCallback(dojo.hitch(this, this._checkResponse));
			this.onSubmit(vals);
		}
	},	

	_checkResponse : function(res) {
		if (res) {
			if (!res.isLoggedIn && res.error) {
				this.attr('message', res.error);
			} else {
				dojo.global.location = res.location;
			}
		}
	},

	onSubmit : function(vals) {
	}
});