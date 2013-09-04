'use strict';

/* Controllers */
angular.module('myApp.controllers', []).
  controller('WarehouseListCtrl', function($scope,$location, DB) {
      $scope.detail = function(productCode) {
        DB.fetchOne('warehouses',productCode,function(product){
          if(product)
          {
            $scope.item = product;
            $scope.amount = product.amount;
            $scope.cost = product.cost;
            $scope.sellingPrice = product.sellingPrice;
          }
          else
          {
            DB.fetchOne('products',productCode,function(product){
              if(product)
              {
                $scope.item = product;
              }
              else
              {
                console.log("detail error: no product" + productCode );
              }
            });
          }
          $scope.$apply();
        });
      };
      $scope.save = function(){

      };
      $scope.new = function() {
        $location.path('/wadd');
      };
      $scope.import = function() {
        //$location.path('/wadd');
      };
      $scope.byType = function(){
        $scope.byWhat = "byType";
        $scope.item = null;
        //$scope.item.img = 'default';
        $scope.types = ["饮料","食品","日化","调味品","香烟","其他"];
        if(!$scope.selectedType)
        {
          $scope.selectedType = "全部";
          DB.fetchAll('warehouses',function(sproducts) {
            $scope.products =  sproducts;
            $scope.$apply();
          });
        }
      };
      $scope.bySearch = function(){
        $scope.byWhat = "bySearch";
        $scope.item = null;
        //$scope.item.img = 'default';

      }
      $scope.change = function(){
        
        var searchText = this.searchText;
        $scope.item = null;
        //$scope.item.img = 'default';
        $scope.sproducts = []; 
        if(searchText.length>7&&!isNaN(searchText))
        {
            DB.fetchOne('warehouses',searchText,function(product) {
                if(product)
                {
                  var products = [];
                  products.push(product);
                  $scope.sproducts =  products;
                  $scope.item = product;
                  $scope.amount = product.amount;
                  $scope.cost = product.cost;
                  $scope.sellingPrice = product.sellingPrice;
                  $scope.$apply();
                }
            });
        }
      }
      $scope.getType = function(type){
        $scope.selectedType = type;

        if(type=='全部')
        {
            DB.fetchAll('warehouses',function(sproducts) {
              $scope.products =  sproducts;
              $scope.$apply();
            });
        }
        else
        {
            DB.fetchItemsByIndex('warehouses','typeIndex',type,function(sproducts) {
              $scope.products =  sproducts;
              $scope.$apply();
            });
        }
      }
      
  })
  .controller('MsgCtrl', function($scope, DB) {

      DB.fetchAll('msgQueue',function(msgs){
          $scope.msgs = msgs;
          $scope.$apply();
      });
      $scope.dealOne = function(msgID)
      {
        DB.delete('msgQueue',msgID,function(){
          $rootScope.$broadcast("msgQueueChanged", {});
        });
      }

  })
  .controller('WarehouseDeatilCtrl', function($scope, DB) {
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
  .controller('WarehouseAddCtrl', function ($scope,$routeParams,$location,DB) {
    
    if($routeParams.productCode)
    {
      $scope.code = $routeParams.productCode;
      $scope.disabled = '';
      var productCode = $scope.code
      if(productCode.length>7&&!isNaN(productCode))
      {
          DB.fetchOne('products',productCode,function(product) {
              if(product)
              {
                $scope.name =  product.name;
                $scope.code =  product.code;
                $scope.type =  product.type;
                $scope.addr =  product.addr;
                $scope.spec =  product.spec;
                $scope.disabled = 'disabled';
                $scope.$apply();
              }
          });
      }
      /*
      var searchText = $routeParams.productCode;
      $scope.sproducts = []; 
      $scope.searchText = searchText;
      if(searchText.length>7&&!isNaN(searchText))
      {
          DB.fetchOne('products',searchText,function(product) {
              if(product)
              {
                var products = [];
                products.push(product);
                $scope.sproducts =  products;
                $scope.item = product;
                $scope.amount = product.amount;
                $scope.cost = product.cost;
                $scope.sellingPrice = product.sellingPrice;
                $scope.$apply();
              }
          });
      }
      */
    }
    $scope.change = function(){

      $scope.disabled = '';
      var productCode = $scope.code
      if(productCode.length>7&&!isNaN(productCode))
      {
          DB.fetchOne('products',productCode,function(product) {
              if(product)
              {
                $scope.name =  product.name;
                $scope.code =  product.code;
                $scope.type =  product.type;
                $scope.addr =  product.addr;
                $scope.spec =  product.spec;
                $scope.disabled = 'disabled';
                $scope.$apply();
              }
          });
      }
    }

    /*
    setTimeout(function () {
        $('#msg-div').removeClass('in')
    }, 4000);
    */
    $scope.addProduct = function(){

      DB.insert('products',{'code': $scope.code, 
        'name' : $scope.name,
        'type' : $scope.type,
        'addr' : $scope.addr,
        'img' : $scope.img ? $scope.img:"img/shoes1.jpg",
        'spec' : $scope.spec
        },
        function()
        {
          $('#msg-div').addClass('alert-success').addClass('in').html("add ok!");
        });
      if($scope.warehouse)
      {
        DB.insert('warehouses',{'code': $scope.code, 
          'name' : $scope.name,
          'type' : $scope.type,
          'addr' : $scope.addr,
          'img' : $scope.img ? $scope.img:"img/shoes1.jpg",
          'spec' : $scope.spec
          },function(){
          });
      }
      $scope.name = '';
      $scope.code = '';
      $scope.type = '';
      $scope.addr = '';
      $scope.spec = '';
      $scope.edit = '';
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
                                'img' :  data[index].img ? data[index].img:"img/shoes1.jpg",
                                'spec' : data[index].d
                                });
                }
                console.log("here");
                $location.path('/wlist');
              }).
              error(function(data, status, headers, config) {
                //无数据，且无法下载数据
                DB.insert('products',{'code': '12344565657', 
                          'name' : 'test',
                          'type' : '饮料',
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
}]);
