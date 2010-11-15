dojo.provide('degrees.Service');

dojo.declare('degrees.Service', null, {

    findConnection : function(endUser) {
        var req = {
            url : "/6Degrees/user/findConnection",
            content : {target : endUser},
            handleAs : 'json',
            preventCache : true
        };
        return dojo.xhrGet(req);
    },

    checkStatus : function() {
        var req = {
            url : "/6Degrees/auth/checkStatus",
            preventCache : true
        };
        return dojo.xhrGet(req);
    },

    sendMessage : function() {

    },

    getUserInfo : function() {
        var req = {
            url : "/6Degrees/user/getInfo",
            handleAs : 'json',
            preventCache : true
        };
        return dojo.xhrGet(req);
    },

    logon : function(creds) {
        var req = {
            url : "/6Degrees/auth/login",
            postData : dojo.toJson(creds),
            handleAs : 'json',
            preventCache : true
        };
        return dojo.xhrPost(req);
    },

    logout : function(creds) {
        var req = {
            url : "/6Degrees/auth/logout",
            handleAs : 'json',
            preventCache : true
        };
        return dojo.xhrGet(req);
    },

    createUser : function(user) {
        var req = {
            url : "/6Degrees/auth/createUser",
            postData : dojo.toJson(user),
            handleAs : 'json',
            preventCache : true
        };
        return dojo.xhrPost(req);
    }
});