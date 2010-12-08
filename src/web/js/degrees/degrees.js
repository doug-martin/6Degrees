dojo.registerModulePath("degrees", "../../degrees");
dojo.provide('degrees');
dojo.require('degrees.Service');

dojo.mixin(degrees, {    
    
    checkStatus : function() {
        var service = new degrees.Service();
        service.checkStatus();        
    },

    formatDate : function(dateString, includeTime){
        var format = {
            datePattern : 'MMM d yyyy'
        };
        if(!includeTime){
           format.selector = 'date';
        }
        return dojo.date.locale.format(new Date(dateString), format)
    }

    /*handleStatus : function(res) {
        if (res.isLoggedIn) {        	           
           var logon = new degrees.Logon();
           container.addChild(logon);           
        }
    }*/   
});

