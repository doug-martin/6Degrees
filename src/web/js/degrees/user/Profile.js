dojo.provide('degrees.user.Profile');

dojo.require('dijit._Widget');
dojo.require('dijit._Templated');
dojo.require("dojo.date.locale");

dojo.declare('degrees.user.Profile', [dijit._Widget, dijit._Templated], {

    user : '',

    name : '',

    birthday : '',

    sex : '',

    email : '',

    templateString : dojo.cache('degrees.user', 'templates/Profile.html'),

     attributeMap : dojo.delegate(dijit._Widget.prototype.attributeMap, {
        name : {node : 'nameNode', type : "innerHTML"},
        birthday : {node : 'birthdayNode', type : "innerHTML"},
        email : {node : 'emailNode', type : "innerHTML"},
        sex : {node : 'sexNode', type : "innerHTML"}
    }),

    _setUserAttr : function(user){
        if(user){
            this.user = user;           
            this.attr('birthday', degrees.formatDate(user.dateOfBirth, false));
            this.attr('email', user.email);
            this.attr('sex', user.sex == 'M' ? 'Male' : 'Female');
        }
    }
});

dojo.declare('degrees.user.ProfilePicture', [dijit._Widget, dijit._Templated], {

    src : '/6Degrees/images/NoPicture.png',

    baseClass : 'degreesUserProfilePicture',

    templateString : "<div class='${baseClass}' dojoAttachEvent='onmouseenter:_showEdit,onmouseleave:_hideEdit'>"
            + "<img dojoAttachPoint='img' src='${src}' class='img'/>"
            + "<span dojoAttachEvent='onclick : _edit' class='edit'></span></div>",

    attributeMap : dojo.delegate(dijit._Widget.prototype.attributeMap, {
        src : {node : 'img', type : "attr"}
    }),

    _showEdit : function() {
       dojo.addClass(this.domNode, this.baseClass+'Hover');
    },

    _hideEdit : function() {
       dojo.removeClass(this.domNode, this.baseClass+'Hover');
    },

    _edit : function(){

    }
});