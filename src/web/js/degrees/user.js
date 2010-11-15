dojo.provide('degrees.user');

dojo.require('degrees.user.layout.Container');
dojo.require('degrees.user.Profile');

dojo.mixin(degrees.user, {
	init : function(){
		var service = new degrees.Service();
		service.getUserInfo().addCallback(dojo.hitch(container, 'attr', 'user'));        
	}
});