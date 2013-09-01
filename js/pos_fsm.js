'use strict';
angular.module('fsm', ['ui']).factory('fsm', function(){
	var fsm = new window.machina.Fsm({
		initialState: "search",
		states : {
			'search' : {
				'select_product' : function(scope) {
					
				}
			},
			'select_product' : {
				'search' : function(scope) {}
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