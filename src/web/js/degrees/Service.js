dojo.provide('degrees.Service');

dojo.declare('degrees.Service', null, {

    findConnection : function(endUser) {
        var req = {
            url : "/6Degrees/findConnection",
            content : {target : endUser},
            preventCache : true
        };
        return dojo.xhrGet(req);
    },

    checkStatus : function() {
        var req = {
            url : "/6Degrees/checkStatus",
            preventCache : true
        };
        return dojo.xhrGet(req);
    },

    sendMessage : function() {

    },

    getUserInfo : function() {
        var req = {
            url : "/6Degrees/getInfo",
            handleAs : 'json',
            preventCache : true
        };
        return dojo.xhrGet(req);
    },

    logon : function(creds) {
        var req = {
            url : "/6Degrees/login",
            postData : dojo.toJson(creds),
            handleAs : 'json',
            preventCache : true
        };
        return dojo.xhrPost(req);
    },

    logout : function(creds) {
        var req = {
            url : "/6Degrees/logout",
            handleAs : 'json',
            preventCache : true
        };
        return dojo.xhrGet(req);
    },

    createUser : function(user) {
        var req = {
            url : "/6Degrees/createUser",
            postData : dojo.toJson(user),
            handleAs : 'json',
            preventCache : true
        };
        return dojo.xhrPost(req);
    }
});