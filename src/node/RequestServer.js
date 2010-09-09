var _ServerBase = require("./_ServerBase")._ServerBase;
var ServerUtil = require("./ServerUtility").ServerUtility;
var dojo = require("./utility/dojo.js");

exports.RequestServer = dojo.declare([_ServerBase, ServerUtil], {});