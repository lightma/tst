'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('WarehouseListCtrl', function($scope,$location, Product) {

      $scope.detail = function(productCode) {
        $location.path('wdetail/'+productCode);
      };
      $scope.byType = function(){
        $scope.byWhat = "byType";
        $scope.types = ["1","2"];
        //$scope.$apply();
      };
      $scope.bySearch = function(){
        $scope.byWhat = "bySearch";
      }
      $scope.change = function(){
        $scope.searchText;
      }
      $scope.getType = function(type){
        $scope.selectedType = type;
        if(type!='all')
        {
          Product.open(function(){
              Product.fetchItemsByIndex('typeIndex',type,function(products) {
                  $scope.tProducts =  products;
                  $scope.$apply();
              });
          });
        }
        else
        {
          Product.open(function(){
              Product.fetchAll(function(products) {
                  $scope.tProducts =  products;
                  $scope.$apply();
              });
          });
        }
      }

  })
  .controller('WarehouseDeatilCtrl', function($scope, $routeParams, Product) {
      Product.fetchOne($routeParams.productCode,function(product){
          $scope.dname = product.name;
          $scope.dcode = product.code;
          $scope.dtype = product.type;
          $scope.daddr = product.addr;
          $scope.dspec = product.spec;
          $scope.$apply();
      });
      $scope.save = function(){ 
      };
  })
  .controller('WarehouseAddCtrl', function ($scope,Product) {
    /*
    setTimeout(function () {
        $('#msg-div').removeClass('in')
    }, 4000);
    */
    $scope.addProduct = function(){	
    	Product.insert({'code': $scope.code, 
    						'name' : $scope.name,
    						'type' : $scope.type,
    						'addr' : $scope.addr,
    						'spec' : $scope.spec
    						},function(){
                                $('#msg-div').addClass('alert-success').addClass('in').html("add ok!");
                            });
        $scope.name = '';
        $scope.code = '';
        $scope.type = '';
        $scope.addr = '';
        $scope.spec = '';
    };

}).controller('PosCtrl', function ($scope) {
	
}).controller('PosProductsListCtrl', function ($scope) {
	var product = function(){
			this.name = "UGG哈哈这个鞋子不错喔",
			this.cost = 20;
			this.spec = "12*250ml";
			this.img = "img/shoes1.jpg";
			this.idx = 0;
	};
	product.prototype.setIdx = function(idx) {
		this.idx = idx;
	};
	var repeat = 23, rowMax = 4;
	var products = [];
	for (var i=0,row=-1; i<repeat; i++) {
		if (i % rowMax == 0) {
			++ row;
			products[row] = [];
		}
		var p = new product();
		p.setIdx(i);
		products[row].push(p);
	}
	$scope.products = products;
});
