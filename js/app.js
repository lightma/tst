/**
 * @file The main logic for the Todo List App.
 * @author Matt West <matt.west@kojilabs.com>
 * @license MIT {@link http://opensource.org/licenses/MIT}.
 */



'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.controllers', 'myApp.services','ngCookies', 'fsm']).
  config(['$routeProvider', function($routeProvider) {
    var access = routingConfig.accessLevels;
    $routeProvider.when('/wlist', {templateUrl: 'warehouse/list.html', controller: 'WarehouseListCtrl',access:access.admin});
    $routeProvider.when('/wdetail/:productCode', {templateUrl: 'warehouse/detail.html', controller: 'WarehouseDeatilCtrl',access:access.admin});
    $routeProvider.when('/wadd', {templateUrl: 'warehouse/add.html', controller: 'WarehouseAddCtrl',access:access.admin});
    $routeProvider.when('/login', {templateUrl: 'public/login.html', controller: 'LoginCtrl',access:access.anon});
    $routeProvider.when('/init', {templateUrl: 'public/init.html', controller: 'InitCtrl',access:access.admin});
    $routeProvider.when('/pos', {templateUrl: 'pos/pos.html', controller: 'PosCtrl',access:access.admin});
    $routeProvider.otherwise({redirectTo: '/pos'});
  }]).
  run(['$rootScope', '$location', 'Auth','DB', function ($rootScope, $location, Auth) {
        chrome.storage.local.get('user',function(value){
          if(value.user)
          {
            Auth.user(value.user);
          }
          $rootScope.$on("$routeChangeStart", function (event, next, current) {
              $rootScope.error = null;
              if (!Auth.authorize(next.access)) 
              {
                if(Auth.isLoggedIn()) 
                  $location.path('/login');
                else                  
                  $location.path('/noauth');
              }
          });         
          if(value.user)
          {
            //自动登录需要判断数据是否存在
            $location.path('/init');
          }
          else
          {
            $location.path('/login');
          }
        });
        
  }
  /*
  ,function($http,$timeout){
      //通过验证
      if(true)
      {
        //汇报身份，校准时间
        var me = {'me':'1234567890'}
        $http.post('http://10.7.124.21/~/daoler/warehouses/me', data).success(function(){var a=1;});
        success(function(){var a=1;});
        var stop = $timeout(function() {
              var data = {'r':[{'p':123,'c':1,'a':12,'s':1}],'s':123456,'t':1356789023};
              //r[p]=123&r[c]=2&r[a]=5&r[s]=3&t=1354567657&s=5
              $http.post('http://10.7.124.21/~/daoler/warehouses/test', data).
              success(function(){var a=1;});
               
        }, 5000);
      }
      //未经过验证
      else
      {

      }
  }
  */
  ]);


