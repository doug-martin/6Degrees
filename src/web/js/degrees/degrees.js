dojo.registerModulePath("degrees", "./degrees");
dojo.provide('degrees');
dojo.require('degrees.Service');
dojo.require('dijit.Dialog');

dojo.mixin(degrees, {
    init : function() {
        degrees.checkStatus();
    },
    
    checkStatus : function() {
        var def = degrees.Service.checkStatus();
        def.addCallback(degrees.handleStatus);
    },

    handleStatus : function(res) {
        if (res.isLoggedIn) {
            alert("Logged In!");
        } else {
            var dialog = new dijit.Dialog({title : 'Please log into Facebook', content : "<fb:login-button></fb:login-button>", style : "width : 200px;text-align:center;"});            
            dialog.startup();
            dialog.show();
            FB.Event.subscribe('auth.sessionChange', dojo.hitch(degrees, degrees.checkStatus));
            FB.init({appId: '150801354942182', status: true, cookie: true, xfbml: true});
        }
    }
});
dojo.addOnLoad(degrees.init);

