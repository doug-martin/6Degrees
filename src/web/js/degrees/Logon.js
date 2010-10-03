dojo.provide('degrees.Logon');

dojo.require('dijit._Widget');
dojo.require('dijit._Templated');
dojo.require('dijit.form.Form');
dojo.require('dijit.form.ValidationTextBox');
dojo.require('dijit.form.Button');

dojo.declare('degrees.Logon', [dijit._Widget, dijit._Templated], {

    widgetsInTemplate : true,

    templateString : dojo.cache('degrees', 'templates/Logon.html'),

    _onSubmit : function(e){
        e.preventDefault();
        if(this.form.validate()){
            var vals = this.form.attr('value');
            alert(vals);
            this.onSubmit(vals);
        }
    },

    onSumbit : function(vals){

    }
});