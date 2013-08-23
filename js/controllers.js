'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('WarehouseListCtrl', function($scope,$location, DB) {
      $scope.detail = function(productCode) {
        $location.path('/wdetail/'+productCode);
      };
      $scope.new = function() {
        $location.path('/wadd');
      };
      $scope.byType = function(){
        $scope.byWhat = "byType";
        $scope.types = ["1","2"];
        // $scope.$apply();
      };
      $scope.bySearch = function(){
        $scope.byWhat = "bySearch";
      }
      $scope.change = function(){
        var searchText = this.searchText;
        $scope.sProducts = []; 
        if(searchText.length>7&&!isNaN(searchText))
        {
            DB.fetchOne('products',searchText,function(products) {
                if(products)
                {
                  $scope.sProducts =  [products];
                  $scope.$apply();
                }
            });
        }
      }
      $scope.getType = function(type){
        $scope.selectedType = type;
        if(type!='all')
        {
            DB.fetchItemsByIndex('products','typeIndex',type,function(products) {
                $scope.tProducts =  products;
                $scope.$apply();
            });
        }
        else
        {
            DB.fetchAll('products',function(products) {
                $scope.tProducts =  products;
                $scope.$apply();
            });
        }
      }
      
  })
  .controller('WarehouseDeatilCtrl', function($scope, $routeParams, DB) {
      DB.fetchOne('products',$routeParams.productCode,function(product){
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
  .controller('WarehouseAddCtrl', function ($scope,$location,DB) {
    /*
	 * setTimeout(function () { $('#msg-div').removeClass('in') }, 4000);
	 */
    $scope.addProduct = function(){	
      DB.insert('products',{'code': $scope.code, 
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
    $scope.back = function() {
        $location.path('/wlist');
    };
    

}).controller('LoginCtrl',
['$rootScope', '$scope', '$location', 'Auth', function($rootScope, $scope, $location, Auth) {

    $scope.login = function() {
        Auth.login({
                username: $scope.username,
                password: $scope.password,
                auto:$scope.auto
            },
            function(res) {
                $location.path('/init');
            },
            function(err) {
                $rootScope.error = "Failed to login";
            });
    };
}]).controller('InitCtrl',
['$scope', '$location', 'Auth','DB','$http', function( $scope, $location, Auth,DB,$http) {
    var user = Auth.user();
    console.log(user);
    if(user.role=='public'||user.username==''||!user.dbname)
      $location.path('/login');
    else
    {
      DB.open(user.dbname, function(){
        DB.count('products',function(count)
          {
            if(count<1)
            {
              $http({method: 'GET', url: 'http://10.7.124.21/~oliverwang/daoler/warehouses/test2'}).
              success(function(data, status, headers, config) {
                for(var index in data){
                      DB.insert('products',{'code': data[index].c, 
                                'name' : data[index].n,
                                'type' : 5,
                                'addr' : 'df',
                                'spec' : data[index].d
                                });
                }
                console.log("here");
                $location.path('/wlist');
              }).
              error(function(data, status, headers, config) {
                // 无数据，且无法下载数据
                DB.insert('products',{'code': '12344565657', 
                          'name' : 'test',
                          'type' : 1,
                          'addr' : 'df',
                          'spec' : 'dfgfggfgh'
                          });
              });
            }
            else
            {
              $location.path('/wlist');
              $scope.$apply();
            }
          });
      });
    }
}]).controller('PosCtrl', function($scope){
	
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
}).controller('PosActCtrl', function($scope){
	
});