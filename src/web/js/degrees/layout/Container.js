dojo.provide('degrees.layout.Container');

dojo.require('dijit.layout._LayoutWidget');
dojo.require('dijit._Templated');

dojo.declare('degrees.layout.Container', [dijit.layout._LayoutWidget, dijit._Templated], {

    baseClass : 'degreesLayoutContainer',

    templateString : dojo.cache('degrees.layout', 'templates/Container.html')
});