dojo.provide('degrees.user.layout.Container');

dojo.require('degrees.layout.Container');
dojo.require('dijit.Toolbar');
dojo.require('dijit.form.Button');

dojo.declare('degrees.user.layout.Container', degrees.layout.Container, {

    baseClass : 'degreesUserLayoutContainer',

    widgetsInTemplate : true,

    templateString : dojo.cache('degrees.user.layout', 'templates/Container.html'),

    _selectedChild : null,

    addChild : function(child) {
        this.inherited(arguments);
        var title = child.title || 'Child ' + this.getChildren().length;
        var button = new dijit.form.Button({label : title});
        this.connect(button, 'onClick', dojo.partial(this._selectChild, child));
        if (!this._selectedChild) {
            this._selectChild(child);
        }
        this.toolbar.addChild(button);
    },

    _logOut : function(){
        new degrees.Service().logout();
        dojo.global.location = '/6Degrees/';
    },

    _selectChild : function(child) {
        if (this._selectedChild != child) {
            this.getChildren().forEach(function(ch) {
                dojo[ch != child ? 'addClass' : 'removeClass'](ch.domNode, 'dijitHidden');
            });
            this._selectedChild = child;
        }
    }
});
