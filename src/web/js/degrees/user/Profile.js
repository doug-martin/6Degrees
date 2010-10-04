dojo.provide('degrees.user.Profile');

dojo.require('dijit._Widget');
dojo.require('dijit._Templated');

dojo.declare('degrees.user.Profile', [dijit._Widget, dijit._Templated], {
	firstName : '',
	
	lastName : '',
	
	dateOfBirth : '',
	
	email : '',
	
	templateString : dojo.cache('degrees.user', 'templates/Profile.html'),
	
	_setDateOfBirthAttr : function(dateString){
		var date = new Date(dateString);
		this.dateOfBirth = (date.getMonth() + 1) + '-' + (date.getDate() + 1) + '-' + date.getFullYear();		
	}
});