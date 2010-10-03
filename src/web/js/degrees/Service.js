dojo.provide('degrees.Service');

dojo.mixin(degrees.Service, {

    findConnection : function(endUser){

    },

    checkStatus : function(){
        var req = {
            url : "/6Degrees/checkStatus",
            handleAs : 'json',
            preventCache : true
        };
        return dojo.xhrGet(req);       
    },

    sendMessage : function(){

    },

    logon : function(creds){
        var req = {
            url : "/6Degrees/logon",
            postData : dojo.toJson(creds),
            handleAs : 'json',
            preventCache : true
        };
        return dojo.xhrPost(req);        
    }
});