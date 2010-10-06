var _ServerBase = require("./_ServerBase")._ServerBase;
var StaticFileServer = require("./ServerUtility").StaticFileServer;
var GetServer = require("./GetServer").GetServer;
var PostServer = require("./PostServer").PostServer;
var _SessionServer = require("./_SessionServer")._SessionServer;
var dojo = require("../../dojo");

exports.RequestServer = dojo.declare([_ServerBase, _SessionServer, GetServer, PostServer, StaticFileServer], {});