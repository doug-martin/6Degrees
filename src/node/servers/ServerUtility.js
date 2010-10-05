var createServer = require("http").createServer;
var readFile = require("fs").readFile;
var sys = require("sys");
var url = require("url");
var dojo = require("../utility/dojo");
var fileServer = exports;

exports.StaticFileServer = dojo.declare(null, (function() {
    function extname(path) {
        var index = path.lastIndexOf(".");
        return index < 0 ? "" : path.substring(index);
    };
    var DEBUG = true;

    return{

        dirs : null,

        files : null,

        errorFiles : null,

        constructor : function() {
            this.dirs = {};
            this.files = {};
            this.errorFiles = {};
        },

        staticHandler : function (filename, code) {
            var body, headers;
            var content_type = this.mime.lookupExtension(extname(filename));

            function loadResponseData(callback) {
                if (body && headers && !DEBUG) {
                    callback();
                    return;
                }
                readFile(filename, function (err, data) {
                    if (err) {                                              
                        callback(err);
                    } else {
                        body = data;
                        headers = { "Content-Type": content_type
                            , "Content-Length": body.length
                        };
                        if(!DEBUG) headers["Cache-Control"] = "public";                        
                        callback();
                    }
                });
            }

            return dojo.hitch(this, function (req, res) {
                var _this = this;
                loadResponseData(function (err) {
                    if(err){                          
                         _this.notFound(req, res);
                    }else{
                        res.writeHead(code, headers);
                        res.end(req.method === "HEAD" ? "" : body);
                    }
                });
            });
        },

        _handleRequest : function(req, res) {
            if (req.method === "GET") {
                var path = url.parse(req.url).pathname;                
                if (this.files[path]) {
                	var file = this.files[path];
                	if(!file.session || req.session.data('user')){
                		return file.handler;
                	}else{
                		res.redirect(this.basePath + '/');
                	}
                } else {
                    var file;
                    var dir;
                    for (var i in this.dirs) {
                    	dir = this.dirs[i];                    
                        var d = dir.dir;
                        var patt = new RegExp(i);
                        if (patt.exec(path)) {
                            file = path.replace(patt, d);
                            break;
                        }
                    }
                    if (file) {
                        this.files[path] = {handler : this.staticHandler(file, 200), session : dir.session};
                        return this.files[path].handler;
                    }
                }
            }
            return this.inherited(arguments);
        },

        getErrorFile : function(code){
            var file = this.errorFiles[code];
            return file.file;
        },

        addDirectoryGet : function(dir) {
            if (dir) {
                var path = this.basePath + dir.path, location = dir.dir;
                this.dirs[dojo.regexp.escapeString(path)] = {dir : location, session : dir.session || false};
            }
        },

        addFileGet : function(file) {
            if (file) {                
                this.files[this.basePath + file.path] = {handler : this.staticHandler(file.file, 200), session : file.session || false};
            }
        },

        addErrorFile : function(file){
            if (file) {
                this.errorFiles[file.code] = {handler : this.staticHandler, file : this.staticHandler(file.file, file.code)};
            }
        },

        mime : {
            // returns MIME type for extension, or fallback, or octet-steam
            lookupExtension : function(ext, fallback) {
                return this.TYPES[ext.toLowerCase()] || fallback || 'application/octet-stream';
            },

            // List of most common mime-types, stolen from Rack.
            TYPES : { ".3gp" : "video/3gpp"
                , ".a" : "application/octet-stream"
                , ".ai" : "application/postscript"
                , ".aif" : "audio/x-aiff"
                , ".aiff" : "audio/x-aiff"
                , ".asc" : "application/pgp-signature"
                , ".asf" : "video/x-ms-asf"
                , ".asm" : "text/x-asm"
                , ".asx" : "video/x-ms-asf"
                , ".atom" : "application/atom+xml"
                , ".au" : "audio/basic"
                , ".avi" : "video/x-msvideo"
                , ".bat" : "application/x-msdownload"
                , ".bin" : "application/octet-stream"
                , ".bmp" : "image/bmp"
                , ".bz2" : "application/x-bzip2"
                , ".c" : "text/x-c"
                , ".cab" : "application/vnd.ms-cab-compressed"
                , ".cc" : "text/x-c"
                , ".chm" : "application/vnd.ms-htmlhelp"
                , ".class" : "application/octet-stream"
                , ".com" : "application/x-msdownload"
                , ".conf" : "text/plain"
                , ".cpp" : "text/x-c"
                , ".crt" : "application/x-x509-ca-cert"
                , ".css" : "text/css"
                , ".csv" : "text/csv"
                , ".cxx" : "text/x-c"
                , ".deb" : "application/x-debian-package"
                , ".der" : "application/x-x509-ca-cert"
                , ".diff" : "text/x-diff"
                , ".djv" : "image/vnd.djvu"
                , ".djvu" : "image/vnd.djvu"
                , ".dll" : "application/x-msdownload"
                , ".dmg" : "application/octet-stream"
                , ".doc" : "application/msword"
                , ".dot" : "application/msword"
                , ".dtd" : "application/xml-dtd"
                , ".dvi" : "application/x-dvi"
                , ".ear" : "application/java-archive"
                , ".eml" : "message/rfc822"
                , ".eps" : "application/postscript"
                , ".exe" : "application/x-msdownload"
                , ".f" : "text/x-fortran"
                , ".f77" : "text/x-fortran"
                , ".f90" : "text/x-fortran"
                , ".flv" : "video/x-flv"
                , ".for" : "text/x-fortran"
                , ".gem" : "application/octet-stream"
                , ".gemspec" : "text/x-script.ruby"
                , ".gif" : "image/gif"
                , ".gz" : "application/x-gzip"
                , ".h" : "text/x-c"
                , ".hh" : "text/x-c"
                , ".htm" : "text/html"
                , ".html" : "text/html"
                , ".ico" : "image/vnd.microsoft.icon"
                , ".ics" : "text/calendar"
                , ".ifb" : "text/calendar"
                , ".iso" : "application/octet-stream"
                , ".jar" : "application/java-archive"
                , ".java" : "text/x-java-source"
                , ".jnlp" : "application/x-java-jnlp-file"
                , ".jpeg" : "image/jpeg"
                , ".jpg" : "image/jpeg"
                , ".js" : "application/javascript"
                , ".json" : "application/json"
                , ".log" : "text/plain"
                , ".m3u" : "audio/x-mpegurl"
                , ".m4v" : "video/mp4"
                , ".man" : "text/troff"
                , ".mathml" : "application/mathml+xml"
                , ".mbox" : "application/mbox"
                , ".mdoc" : "text/troff"
                , ".me" : "text/troff"
                , ".mid" : "audio/midi"
                , ".midi" : "audio/midi"
                , ".mime" : "message/rfc822"
                , ".mml" : "application/mathml+xml"
                , ".mng" : "video/x-mng"
                , ".mov" : "video/quicktime"
                , ".mp3" : "audio/mpeg"
                , ".mp4" : "video/mp4"
                , ".mp4v" : "video/mp4"
                , ".mpeg" : "video/mpeg"
                , ".mpg" : "video/mpeg"
                , ".ms" : "text/troff"
                , ".msi" : "application/x-msdownload"
                , ".odp" : "application/vnd.oasis.opendocument.presentation"
                , ".ods" : "application/vnd.oasis.opendocument.spreadsheet"
                , ".odt" : "application/vnd.oasis.opendocument.text"
                , ".ogg" : "application/ogg"
                , ".p" : "text/x-pascal"
                , ".pas" : "text/x-pascal"
                , ".pbm" : "image/x-portable-bitmap"
                , ".pdf" : "application/pdf"
                , ".pem" : "application/x-x509-ca-cert"
                , ".pgm" : "image/x-portable-graymap"
                , ".pgp" : "application/pgp-encrypted"
                , ".pkg" : "application/octet-stream"
                , ".pl" : "text/x-script.perl"
                , ".pm" : "text/x-script.perl-module"
                , ".png" : "image/png"
                , ".pnm" : "image/x-portable-anymap"
                , ".ppm" : "image/x-portable-pixmap"
                , ".pps" : "application/vnd.ms-powerpoint"
                , ".ppt" : "application/vnd.ms-powerpoint"
                , ".ps" : "application/postscript"
                , ".psd" : "image/vnd.adobe.photoshop"
                , ".py" : "text/x-script.python"
                , ".qt" : "video/quicktime"
                , ".ra" : "audio/x-pn-realaudio"
                , ".rake" : "text/x-script.ruby"
                , ".ram" : "audio/x-pn-realaudio"
                , ".rar" : "application/x-rar-compressed"
                , ".rb" : "text/x-script.ruby"
                , ".rdf" : "application/rdf+xml"
                , ".roff" : "text/troff"
                , ".rpm" : "application/x-redhat-package-manager"
                , ".rss" : "application/rss+xml"
                , ".rtf" : "application/rtf"
                , ".ru" : "text/x-script.ruby"
                , ".s" : "text/x-asm"
                , ".sgm" : "text/sgml"
                , ".sgml" : "text/sgml"
                , ".sh" : "application/x-sh"
                , ".sig" : "application/pgp-signature"
                , ".snd" : "audio/basic"
                , ".so" : "application/octet-stream"
                , ".svg" : "image/svg+xml"
                , ".svgz" : "image/svg+xml"
                , ".swf" : "application/x-shockwave-flash"
                , ".t" : "text/troff"
                , ".tar" : "application/x-tar"
                , ".tbz" : "application/x-bzip-compressed-tar"
                , ".tcl" : "application/x-tcl"
                , ".tex" : "application/x-tex"
                , ".texi" : "application/x-texinfo"
                , ".texinfo" : "application/x-texinfo"
                , ".text" : "text/plain"
                , ".tif" : "image/tiff"
                , ".tiff" : "image/tiff"
                , ".torrent" : "application/x-bittorrent"
                , ".tr" : "text/troff"
                , ".txt" : "text/plain"
                , ".vcf" : "text/x-vcard"
                , ".vcs" : "text/x-vcalendar"
                , ".vrml" : "model/vrml"
                , ".war" : "application/java-archive"
                , ".wav" : "audio/x-wav"
                , ".wma" : "audio/x-ms-wma"
                , ".wmv" : "video/x-ms-wmv"
                , ".wmx" : "video/x-ms-wmx"
                , ".wrl" : "model/vrml"
                , ".wsdl" : "application/wsdl+xml"
                , ".xbm" : "image/x-xbitmap"
                , ".xhtml" : "application/xhtml+xml"
                , ".xls" : "application/vnd.ms-excel"
                , ".xml" : "application/xml"
                , ".xpm" : "image/x-xpixmap"
                , ".xsl" : "application/xml"
                , ".xslt" : "application/xslt+xml"
                , ".yaml" : "text/yaml"
                , ".yml" : "text/yaml"
                , ".zip" : "application/zip"
            }
        }
    }
})());