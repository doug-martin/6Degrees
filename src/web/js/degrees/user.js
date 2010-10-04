dojo.provide('degrees.user');

dojo.require('degrees.user.Profile');

dojo.mixin(degrees.user, {
	init : function(){
		var service = new degrees.Service();
		service.getUserInfo().addCallback(function(info){
			container.addChild(new degrees.user.Profile(info));
		});
	}
});