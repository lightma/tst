'use strict';
angular.module('myApp.services').factory('PosFsm', function(){
	var fsm = new window.machina.Fsm({
		initialState: "search",
		states : {
			'search' : {
				'select_product' : function(scope) {
					
				}
			},
			'select_product' : {
				'search' : function(scope) {},
				'next' : function(scope) {},
				'prev': function(scope) {}
			},
			'confirm_product' : {
				'add' : function(scope) {},
				'sub' : function(scope) {},
				'search' : function(scope) {
					
				}
			}
		}
	});
	return fsm;
});