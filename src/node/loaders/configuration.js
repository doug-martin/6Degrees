var sys = require("sys");
var http = require("http");
var url = require("url");
var path = require("path");
var dojo = require("../utility/dojo.js");
var readFile = require("fs").readFile;
var modules = {};

function resolveMethods(methodObj, httpMethod, server) {
    console.log("loading " + httpMethod + " methods");
    var methods = methodObj.methods || [];
    for (var i in methods) {
        var method = methods[i];
        console.log("loading method", sys.inspect(method));
        var handlerClass = method.handler, operations = method.operations;
        var handler;
        if ((handler = modules[handler]) == null) {
            modules[handlerClass] = (handler = require(handlerClass));
        }
        for (var j in operations) {
            var operation = operations[j];
            var func = operation.method;
            var params = operation.params || "";
            server[httpMethod.toLowerCase() + "Request"](server.basePath + '/' + func, handler[func], params, handler);
        }
    }
}

function parseConfiguration(serverArr) {
    for (var i in serverArr) {
        var json = serverArr[i];
        var port = json.port || "8080";
        var host = json.host || "localhost";
        var path = json.path || "/";
        var GET = json.GET || null;
        var POST = json.POST || null;
        var PUT = json.PUT || null;
        var DELETE = json.DELETE || null;
        var welcomeFiles = json.welcomeFiles;
        var errorFiles = json.errorFiles;
        var serverClass = json.server;
        var server = require(serverClass)[serverClass.substring(serverClass.lastIndexOf("/") + 1)];
        server = new server({basePath : path});
        if (GET) {
            var dirs = GET.dirs || null;
            if (dirs) {
                dojo.forEach(dirs, server.addDirectoryGet, server);
            }
            resolveMethods(GET, "GET", server);
        }
        if (POST) {
            resolveMethods(POST, "POST", server);
        }
        if (PUT) {
            resolveMethods(PUT, "PUT", server);
        }
        if (DELETE) {
            resolveMethods(DELETE, "DELETE", server);
        }
        if (welcomeFiles) {
            console.log("loading welcomeFiles methods");
            dojo.forEach(welcomeFiles, server.addFileGet, server);
        }
        if (errorFiles) {
            console.log("loading errorFiles methods");
            dojo.forEach(errorFiles, server.addErrorFile, server);
        }
        console.log("starting server");
        server.listen(port, host);
    }
}

exports.load = function(file) {
    var json;
    console.log("Reading configuration at : ", file);
    readFile(file, function (err, data) {
        if (err) {
            console.log(sys.inspect(err), process.cwd());
            console.log("Error loading configuration file : " + filename);
        } else {
            parseConfiguration(JSON.parse(data));
        }
    });
};