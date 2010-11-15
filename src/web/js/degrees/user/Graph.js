dojo.provide('degrees.user.Graph');

dojo.require('dijit._Widget');
dojo.require("dojox.image._base");

dojo.declare('degrees.user.Graph', dijit._Widget, {

    path : null,

    thumbWidth : 50,

    thumbHeight : 50,

    width : 100,

    height : 100,

    thumbUrl : '/6Degrees/image/getProfilePic?id={id}&width={width}&height={height}',

    constructor : function() {
        this.path = [];
    },

    startup : function() {
        if (!this._started) {
            this.inherited(arguments);
            dojo.style(this.domNode, {width : this.width + 'px', height : this.height + 'px'});
            this.paper = Raphael(this.domNode, this.width, this.height);
            this._createCircles();
        }
    },

    destroy : function() {
        this.paper.clear();
        this.paper = null;
        this.inherited(arguments);
    },

    _setPathAttr : function(path) {
        if (path && path.length) {
            this.path = path;
            if (this._started) {
                this._createCircles();
            }
        }
    },

    _createCircles : function() {
        if (this.path && this.path.length) {
            this.paper.clear();
            var length = this.path.length;
            var w = (this.width / (length + 1));
            var h = (this.height / (length + 1));
            var sp = w / (length + 1);
            var totalWidth = length * (w + sp);
            var x = (this.width - totalWidth) / 2, y = (this.height) / 2 - h / 2;
            dojo.forEach(this.path, function(usr) {
                var url = dojo.replace(this.thumbUrl, {
                    id : usr.id,
                    width : w,
                    height : h
                });
                var images = dojox.image.preload([url]);
                var tmpImg = images[0], thisX = x, thisY = y, img, text, box;
                var imgLoad = dojo.connect(tmpImg, 'onload', dojo.hitch(this, function() {
                    dojo.disconnect(imgLoad);
                    console.log('hello');
                    var newH = tmpImg.height, newW = tmpImg.width;
                    var iXOffset = w - newW, iYOffset = newH / 2 - newH / 2;
                    //thisX = thisX + iXOffset;
                    var set = this.paper.set();
                    var rectW = newW * 1.1, rectH = newH * 1.1;
                    set.push((box = this.paper.rect(thisX + (w / 2 - rectW / 2), thisY + (h / 2 - rectH / 2), rectW, rectH, 10).attr({fill : "#708090", stroke : "#708090"})));
                    set.push((img = this.paper.image(url, thisX + (w / 2 - newW / 2), thisY, newW, newH).attr({stroke : '#FFF'})));
                    set.push((text = this.paper.text(thisX + w / 2, (y + h) + 30, usr.name).attr({stroke : '#708090', fill : '#708090', 'font-family' : 'sans-serif', 'font-size' : 14})));
                    set.hover(function() {
                        box.animate({scale : 1.2}, 300, 'bounce');
                        img.animate({scale : 1.2}, 300, 'bounce');
                    }, function() {
                        box.animate({scale : 1.0}, 300, 'bounce');
                        img.animate({scale : 1.0}, 300, 'bounce');
                    });
                    this.paper.safari();
                }));
                x += w + sp;
            }, this);
        }
    }

});