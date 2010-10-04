dojo.registerModulePath("degrees", "../../degrees");
dojo.provide('degrees');
dojo.require('degrees.Service');
dojo.require('dijit.Dialog');
dojo.require('degrees.layout.Container');
dojo.require('degrees.Logon');

dojo.mixin(degrees, {    
    
    checkStatus : function() {
        var service = new degrees.Service();
        service.checkStatus();        
    }

    /*handleStatus : function(res) {
        if (res.isLoggedIn) {        	           
           var logon = new degrees.Logon();
           container.addChild(logon);           
        }
    }*/   
});

