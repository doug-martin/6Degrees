var _ServerBase = require("./_ServerBase")._ServerBase;
var StaticFileServer = require("./ServerUtility").StaticFileServer;
var GetServer = require("./GetServer").GetServer;
var PostServer = require("./PostServer").PostServer;
var dojo = require("../utility/dojo.js");

exports.RequestServer = dojo.declare([_ServerBase, GetServer, PostServer, StaticFileServer], {});