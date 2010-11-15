dojo.provide('degrees.user.layout.Container');

dojo.require('degrees.layout.Container');
dojo.require('dijit.Toolbar');
dojo.require('dijit.form.Button');
dojo.require('dijit.form.ComboBox');
dojo.require('dojox.data.JsonRestStore');
dojo.require('degrees.Service');
dojo.require('degrees.user.Graph');
dojo.require('degrees.user.FindConnection');
dojo.require('dijit.Dialog');

dojo.declare('degrees.user.layout.Container', degrees.layout.Container, {

    CONNECTION_TITLE : 'Connection',

    baseClass : 'degreesUserLayoutContainer',

    widgetsInTemplate : true,

    user : null,

    name : '',

    widgetsInTemplate : true,

    templateString : dojo.cache('degrees.user.layout', 'templates/Container.html'),

    _selectedChild : null,

    attributeMap : dojo.delegate(dijit._Widget.prototype.attributeMap, {
        name : {node : 'nameNode', type : "innerHTML"}
    }),

    postCreate : function() {
        this.service = new degrees.Service();
        

    },

    addChild : function(child, index) {
        this.inherited(arguments);
        var title = child.title || 'Child ' + this.getChildren().length;
        var button = new dijit.form.Button({label : title, class:'button'});
        this.connect(button, 'onClick', dojo.partial(this._selectChild, child));
        if (!this._selectedChild) {
            this._selectChild(child);
        }else{
            dojo.addClass(child.domNode, 'dijitHidden');
        }
        this.toolbar.addChild(button, index);
        dojo.style(child.domNode, {height : this.dim.h + 'px', width : this.dim.w + 'px'});
    },
   

    _setUserAttr : function(user) {
        if (user) {
            this.attr("name", user.name);
            this.addChild(new degrees.user.Profile({user : user}), 0);
            this.addChild(new degrees.user.FindConnection(), 1);
        }
    },

    _logOut : function() {
        this.service.logout();
        setTimeout(function(){dojo.global.location = '/6Degrees/';},100);        
    },

    _selectChild : function(child) {
        if (this._selectedChild != child) {
            this.getChildren().forEach(function(ch) {
                dojo[ch != child ? 'addClass' : 'removeClass'](ch.domNode, 'dijitHidden');
            });
            this._selectedChild = child;
        }
    },

    layout : function(){
        this.dim = dojo.position(this.containerNode);
        this.getChildren().forEach(function(child){
             dojo.style(child.domNode, {height : this.dim.h + 'px', width : this.dim.w + 'px'});
        }, this);
                
    }
});
