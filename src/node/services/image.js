var dojo = require("../lib/dojo");
var userUtil = require('../util/UserUtil').UserUtil;
var formidable = require('../lib/formidable');
var sys = require('sys');
var fs = require('fs');
var child_process = require('child_process');

var UserUtil = new userUtil;

exports.setProfilePic = function(req, res) {
    var session = req.session;
    var id;
    if (session && (id = session.data('user'))) {
        console.log("Setting profile picture " + id);
        var form = new formidable.IncomingForm();
        form.parse(req, function(err, fields, files) {
            console.log(sys.inspect({fields: fields, files: files}));
            fs.readFile(files.upload.path, function(err, data) {
                scale(data, files.upload.mime, 300, 300, function(img, mime) {
                    UserUtil.setProfilePicture(id, img, mime, function() {
                        child_process.exec('rm ' + files.upload.path);
                        image = "<html><body><textarea>{uploaded : true}</textarea></body></html>";
                        res.simpleHTML(200, image);
                    });
                });
            });
        });
    }
};

exports.getProfilePic = function(id, req, res) {
    var session = req.session;
    if (session) {
        if(!id){
            id = session.data('user');
        }
        console.log("Getting profile picture " + id);
        UserUtil.getProfilePicture(id, function(image, mime) {
            if (image) {
                res.image(image, mime);
            } else {
                fs.readFile(__dirname + '/../../web/images/NoPicture.png', function(err, data) {
                    res.image(data, 'image/png');
                });
            }
        });
    }
};

exports.getProfileForUser = function(id, width, height, req, res) {
    var session = req.session;

    console.log("Getting profile picture " + id);
    UserUtil.getProfilePicture(id, function(image, mime) {
        if (image) {
            scale(image, 'image/png', width, height, dojo.hitch(res, res.image));
        } else {
            fs.readFile(__dirname + '/../../web/images/NoPicture.png', function(err, data) {
                scale(data, 'image/png', width, height, dojo.hitch(res, res.image));
            });
        }


    });

};

function scale(image, mime, width, height, callback) {
    width = width || 50,height = height || 50;
    var fileName = '/tmp/' + Math.random() * new Date().getTime() + lookupMime(mime);
    fs.writeFile(fileName, image, 'binary', function() {
        var newFileName = '/tmp/' + Math.random() * new Date().getTime() + '.jpeg';
        var child = child_process.exec('convert ' + fileName + ' -resize ' + width + 'x' + height + ' ' + newFileName,
                function (error, stdout, stderr) {
                    if (!error) {
                        fs.readFile(newFileName, function(err, data) {
                            if (data) {
                                callback(data, 'image/jpeg')
                            }
                            child_process.exec('rm ' + fileName);
                            child_process.exec('rm ' + newFileName);
                        })
                    }
                });
    });
}

function lookupMime(mime) {
    switch (mime) {
        case 'image/png':
            return '.png';
            break;
        case 'image/jpeg':
        case 'image/jpg':
            return '.jpeg';
            break;
    }
    return png;
}
