/**
 * @file The main logic for the Todo List App.
 * @author Matt West <matt.west@kojilabs.com>
 * @license MIT {@link http://opensource.org/licenses/MIT}.
 */



'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.controllers', 'myApp.services']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/wlist', {templateUrl: 'warehouse/list.html', controller: 'WarehouseListCtrl'});
    $routeProvider.when('/wdetail/:productCode', {templateUrl: 'warehouse/detail.html', controller: 'WarehouseDeatilCtrl'});
    $routeProvider.when('/wadd', {templateUrl: 'warehouse/add.html', controller: 'WarehouseAddCtrl'});
    $routeProvider.when('/pos', {templateUrl: 'pos/pos.html', controller: 'PosCtrl'});
    $routeProvider.otherwise({redirectTo: '/pos'});
  }]);


/*
var myApp = angular.module('myApp', []);
function ProductsController($scope) {
  $scope.products = '';
  var getAllProducts = function() {
    productsDB.fetchAll(function(products) {
      $scope.products =  products;
      $scope.$apply();
    });
  };
  productsDB.open(getAllProducts);
  $(document).ready(function(){
    $("#by-type").click(function(){
      $(this).addClass('active');
      $("#by-search").removeClass('active');
      $("#search-div").addClass('hide');
      $("#mainType-div").removeClass('hide');
      $("#subType-div").removeClass('hide');
      productsDB.fetchItemsByIndex("typeIndex","1",function(products){
        $scope.products =  products;
        $scope.$apply();
      });
    });
    $("#by-search").click(function(){
      $(this).addClass('active');
      $("#by-type").removeClass('active');
      $("#search-div").removeClass('hide');
      $("#mainType-div").addClass('hide');
      $("#subType-div").addClass('hide');
    });
    $("#detail-close-button").click(function(){
      $("#detail-div").addClass('hide');
      $("#import-div").removeClass('hide');
    }); 
    $(".products").live('click',function(){
      $("#detail-div").removeClass('hide');
      $("#import-div").addClass('hide');
      productsDB.fetchOne(this.id,function(product){
          $("#detail-name").html(product.name);
          $("#detail-type").html(product.type);
      });
    });
    $("#add-button").click(function(){
      $('#add-div').modal('show');
    });
    var $alert = $('#msg-div').alert()
      setTimeout(function () {
        $alert.removeClass('in')
    }, 4000)
    $("#form-add").click(function(){
      var product = {'code':$('#form-code').val(),'type':$('#form-type').val(),'name':$('#form-name').val(),
                     'unit':$('#form-unit').val(),'cost':$('#form-cost').val(),'number':$('#form-number').val()};
      productsDB.insert(product, function(item) {
        getAllProducts();
        $('#msg-div').addClass('alert-success').addClass('in');
      });
      return false;
    });
   });
}

// Update the list of todo items.

/*
window.onload = function() {
  
  // Display the todo items.
  todoDB.open(refreshTodos);
  
  
  // Get references to the form elements.
  var newTodoForm = document.getElementById('new-todo-form');
  var newTodoInput = document.getElementById('new-todo');
  
  
  // Handle new todo item form submissions.
  newTodoForm.onsubmit = function() {
    // Get the todo text.
    var text = newTodoInput.value;
    
    // Check to make sure the text is not blank (or just spaces).
    if (text.replace(/ /g,'') != '') {
      // Create the todo item.
      todoDB.createTodo(text, function(todo) {
        refreshTodos();
      });
    }
    
    // Reset the input field.
    newTodoInput.value = '';
    
    // Don't send the form.
    return false;
  };
  
}

// Update the list of todo items.
function refreshTodos() {  
  todoDB.fetchTodos(function(todos) {
    var todoList = document.getElementById('todo-items');
    todoList.innerHTML = '';
    
    for(var i = 0; i < todos.length; i++) {
      // Read the todo items backwards (most recent first).
      var todo = todos[(todos.length - 1 - i)];

      var li = document.createElement('li');
      var checkbox = document.createElement('input');
      checkbox.type = "checkbox";
      checkbox.className = "todo-checkbox";
      checkbox.setAttribute("data-id", todo.timestamp);
      
      li.appendChild(checkbox);
      
      var span = document.createElement('span');
      span.innerHTML = todo.text;
      
      li.appendChild(span);
      
      todoList.appendChild(li);
      
      // Setup an event listener for the checkbox.
      checkbox.addEventListener('click', function(e) {
        var id = parseInt(e.target.getAttribute('data-id'));

        todoDB.deleteTodo(id, refreshTodos);
      });
    }

  });
}
*/


