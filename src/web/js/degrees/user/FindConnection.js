dojo.provide('degrees.user.FindConnection');

dojo.require('dijit._Widget');
dojo.require('dijit._Templated');
dojo.require('degrees.Service');


dojo.declare('degrees.user.FindConnection', [dijit._Widget, dijit._Templated], {

    title : 'Find Connection',

    searchUrl : '/6Degrees/users/search',

    templateString : dojo.cache('degrees.user', 'templates/FindConnection.html'),

    postCreate : function() {
        this.service = new degrees.Service();
        this.searchStore = new dojox.data.JsonRestStore({target : this.searchUrl});
        this.searchCombo = new dijit.form.ComboBox({
            hasDownArrow : false,
            store : this.searchStore,
            autoComplete : false,
            searchAttr : 'name',
            queryExpr : '${0}'}, this.searchBox);
        this.connect(this.searchCombo, 'onChange', function() {
            dojo.removeClass(this.searching, 'dijitHidden');
            dojo.addClass(this.graphNode, 'dijitHidden');
            var item = this.searchCombo.attr('item');
            this._findConnection(item.id);
        });
    },

    _findConnection : function(id) {
        this.service.findConnection(id).addCallback(dojo.hitch(this, function(connection) {
            if (!this.graph) {
                var dim = dojo.position(this.domNode);
                this.graph = new degrees.user.Graph({width : dim.w, height : dim.h * .8}, this.graphNode);
                this.graph.startup();
                this.connect(this.graph, 'onImageClick', this.onImageClick)
            }
            dojo.addClass(this.searching, 'dijitHidden');
            dojo.removeClass(this.graphNode, 'dijitHidden');
            this.graph.attr('path', connection);
        }));
    },

    onImageClick : function(id){}
});
