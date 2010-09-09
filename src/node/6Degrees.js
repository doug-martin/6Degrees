var sys = require("sys"),
        http = require("http"),
        url = require("url"),
        path = require("path"),
        rs = require("./RequestServer").RequestServer;

var PORT = 8080;
var HOST = "localhost";

var server = new rs();

server.get("/", server.staticHandler("../web/index.html"));

server.get("/findConnection", function() {
});
server.get("/sendMessage", function() {
});
server.get("/getPersonInfo", function() {
});
server.get("/findConnection", function() {
});

server.listen(PORT, HOST);


