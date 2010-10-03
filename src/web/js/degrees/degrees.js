dojo.registerModulePath("degrees", "../../degrees");
dojo.provide('degrees');
dojo.require('degrees.Service');
dojo.require('dijit.Dialog');
dojo.require('degrees.layout.Container');
dojo.require('degrees.Logon');

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
           var logon = new degrees.Logon();
           container.addChild(logon);
           var han = dojo.connect(logon, 'onSubmit', function(vals){
                dojo.disconnect(han);
                var def = degrees.Service.logon(vals);
               def.addCallback(degrees.handleStatus);
           });
        }
    }
});
dojo.addOnLoad(degrees.init);

