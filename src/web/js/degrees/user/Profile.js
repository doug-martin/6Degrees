dojo.provide('degrees.user.Profile');

dojo.require('dijit._Widget');
dojo.require('dijit._Templated');
dojo.require("dojo.date.locale");
dojo.require("dojo.io.iframe");
dojo.require('degrees.Service');
dojo.require('degrees.user.Messages');

dojo.declare('degrees.user.Profile', [dijit._Widget, dijit._Templated], {

    user : '',

    name : '',

    birthday : '',

    sex : '',

    email : '',

    title : 'Profile',

    widgetsInTemplate : true,

    templateString : dojo.cache('degrees.user', 'templates/Profile.html'),

    attributeMap : dojo.delegate(dijit._Widget.prototype.attributeMap, {
        name : {node : 'nameNode', type : "innerHTML"},
        birthday : {node : 'birthdayNode', type : "innerHTML"},
        email : {node : 'emailNode', type : "innerHTML"},
        sex : {node : 'sexNode', type : "innerHTML"}
    }),

    _setUserAttr : function(user) {
        if (user) {
            this.user = user;
            this.attr('name', user.name);
            this.attr('birthday', degrees.formatDate(user.dateOfBirth, false));
            this.attr('email', user.email);
            this.attr('sex', user.sex);
            this.profilePicture.attr('userId', user.id);
            this.messages.attr('usrId', user.id);
            this.messages.attr('messages', user.messages);            
        }
    },

    onMessageClick : function(id){}
});

dojo.declare('degrees.user.ProfilePicture', [dijit._Widget, dijit._Templated], {

    userId : null,

    srcUrl : '/6Degrees/image/profile',

    src : '',

    baseClass : 'degreesUserProfilePicture',

    uploadUrl : '/6Degrees/image/profile',

    templateString : "<div class='${src}' dojoAttachEvent='onmouseenter:_showEdit,onmouseleave:_hideEdit'>"
            + "<img dojoAttachPoint='img' src='${srcUrl}' class='img'/>"
            + "<span dojoAttachPoint='editNode' class='edit'><input class='fileUploader' name='upload' dojoAttachPoint='fileInput' dojoAttachEvent='onchange : _edit' type='file'/></span></div>",

    attributeMap : dojo.delegate(dijit._Widget.prototype.attributeMap, {
        src : {node : 'img', type : "attr"}
    }),

    _setUserIdAttr : function(id){
        this.userId = id;
        this.attr('src', this.srcUrl + '?id=' + id);
        this.img.src = this.src;
    },

    startup : function() {
        if (!this._started) {
            this.service = new degrees.Service();
            this.inherited(arguments);
        }
    },

    _showEdit : function() {
        dojo.addClass(this.domNode, this.baseClass + 'Hover');
    },

    _hideEdit : function() {
        dojo.removeClass(this.domNode, this.baseClass + 'Hover');
    },

    _edit : function(val) {
        this.sendForm = dojo.create('form', {enctype : "multipart/form-data", style : {opacity : 0}}, dojo.body());
        this.sendForm.appendChild(this.fileInput);
        dojo.io.iframe.send({
            url: this.uploadUrl,
            form: this.sendForm,
            handleAs: "json",
            handle: dojo.hitch(this, "_handleSend")
        });
    },

    _handleSend : function(res) {
        dojo.place(this.fileInput, this.editNode);
        dojo.destroy(this.sendForm);
        if(res.uploaded){
            dojo.destroy(this.img);
            this.img = dojo.create('img', {src : this.src + '?preventcache='+ Math.random()}, this.domNode, 'first');
            dojo.addClass(this.img, 'img');
        }
    }
});