dojo.provide('degrees.user.Messages');

dojo.require('dijit._Widget');
dojo.require('dijit._Templated');
dojo.require("dojo.date.locale");
dojo.require('dijit.form.Textarea');
dojo.require('degrees.Service');

dojo.declare('degrees.user.Messages', [dijit.layout._LayoutWidget, dijit._Templated], {

    messages : null,

    usrId : null,

    widgetsInTemplate : true,

    templateString : dojo.cache('degrees.user', 'templates/Messages.html'),

    constructor : function() {
        this.messages = [];
        this.service = new degrees.Service();
    },

    _setMessagesAttr : function(messages) {
        this.getChildren().forEach(function(child){this.removeChild(child)}, this)
        if (messages && messages.length) {
            this.messages = messages.reverse();
            dojo.forEach(messages, function(msg) {
                var child = new degrees.user.Message({message : msg});
                this.addChild(child);
                this.connect(child, 'onMessageClick', this.onMessageClick);
            }, this);
        }
    },

    _postMessage : function(e) {
        e.preventDefault();
        if (this.form.validate()) {
            var vals = this.form.attr('value');
            this.service.postMessage(this.usrId, vals.message).addCallback(dojo.hitch(this, function(res){
                this.addChild(new degrees.user.Message({message : res.message}), 0);
            }));            
        }
        return false;
    },

    onMessageClick : function(id){}
});

dojo.declare('degrees.user.Message', [dijit._Widget, dijit._Templated], {

    message : null,

    thumbWidth : 40,

    thumbHeight : 40,

    thumbUrl : '/6Degrees/image/getProfilePic?id={id}&width={width}&height={height}',

    templateString : dojo.cache('degrees.user', 'templates/Message.html'),

    _setMessageAttr : function(message) {
        if (message) {
            this.userId = message.from;
            this.timeNode.innerHTML = dojo.date.locale.format(new Date(message.time), {datePattern : "MMM d, "});
            this.image.src = dojo.replace(this.thumbUrl, {id : message.from, width : this.thumbWidth, height : this.thumbHeight});
            this.messageNode.innerHTML = message.message;
        }
    },

    _selectUser : function(){
        this.onMessageClick(this.userId);
    }

});