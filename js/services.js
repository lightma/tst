'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', []).
factory('DB', function(){
	
	var f = (function() {
	  var IDB = {};
	  var db = null;

	  /**
	   * Open a connection to the datastore.
	   */
	  IDB.open = function(name,callback) {
	    // Database version.
	    var version = 1;
	/*
	   var deleteDbRequest = indexedDB.deleteDatabase('myapp');
	   deleteDbRequest.onsuccess = function (event) {
	      // database deleted successfully
	   };
	   deleteDbRequest.onerror = function (e) {
	      console.log("Database error: " + e.target.errorCode);
	   };
	*/

	    // Open a connection to the datastore.
	    var request = indexedDB.open(name, version);

	    // Handle datastore upgrades.
	    request.onupgradeneeded = function(e) {
	      var db = e.target.result;

	      e.target.transaction.onerror = IDB.onerror;
	      //db.deleteObjectStore('products');
	      // Delete the old datastore.
	      if (db.objectStoreNames.contains('products')) {
	        db.deleteObjectStore('products');
	      }
	      if (db.objectStoreNames.contains('warehouses')) {
	        db.deleteObjectStore('warehouses');
	      }

	      // Create a new datastore.
	      var store = db.createObjectStore('products', {
	        keyPath: 'code'
	      });
	      store.createIndex("typeIndex", "type", { unique: false });
	      var store = db.createObjectStore('warehouses', {
	        keyPath: 'code'
	      });
	      store.createIndex("typeIndex", "type", { unique: false });
	    };

	    // Handle successful datastore access.
	    request.onsuccess = function(e) {
	      // Get a reference to the DB.
	      db = e.target.result;
	      
	      // Execute the callback.
	      callback();
	    };

	    // Handle errors when opening the datastore.
	    request.onerror = IDB.onerror;
	  };

	  IDB.onerror = function(e) {
	      // Get a reference to the DB.
	      console.log("Database error: " + e.target);
	    };
	  /**
	   * Fetch all of the items in the datastore.
	   * @param {function} callback A function that will be executed once the items
	   *                            have been retrieved. Will be passed a param with
	   *                            an array of the  items.
	   */
	  IDB.fetchAll = function(table,callback) {
	    var transaction = db.transaction([table], 'readwrite');
	    var objStore = transaction.objectStore(table);
	    var cursorRequest = objStore.openCursor();

	    var items = [];

	    transaction.oncomplete = function(e) {
	      // Execute the callback function.
	      callback(items);
	    };

	    cursorRequest.onsuccess = function(e) {
	      var result = e.target.result;
	      
	      if (!!result == false) {
	        return;
	      }
	      
	      items.push(result.value);

	      result.continue();
	    };

	    cursorRequest.onerror = IDB.onerror;
	  };

	  /**
	   * Fetch items by index in the datastore.
	   * @param {function} callback A function that will be executed once the items
	   *                            have been retrieved.
	   */
	  IDB.fetchItemsByIndex = function(table,key,value,callback) {
	    var transaction = db.transaction([table], 'readwrite');
	    var objStore = transaction.objectStore(table);
	    var index = objStore.index(key);
	    var range = IDBKeyRange.only(value);
	    var items = [];
	    var cursorRequest = index.openCursor(range);
	    transaction.oncomplete = function(e) {
	      // Execute the callback function.
	      callback(items);
	    };  
	    cursorRequest.onsuccess = function(evt) {
	       var cursor = evt.target.result;
	       if (cursor) {
	          items.push(cursor.value);
	          cursor.continue();
	       }
	    };
	    cursorRequest.onerror = IDB.onerror;
	  };

	  /**
	   * Fetch one item by keypath in the datastore.
	   * @param {function} callback A function that will be executed once the item
	   *                            have been retrieved. Will be passed a param with
	   *                            an obj .
	   */
	  IDB.fetchOne = function(table,code,callback) {
	    var transaction = db.transaction([table], 'readwrite');
	    var objStore = transaction.objectStore(table);
	    var request = objStore.get(code);
	    request.onsuccess = function(e) {
	      var item = e.target.result;
	      callback(item);
	    };
	    request.onerror = IDB.onerror;
	  };


	  /**
	   * @param {obj} item to be deleted.
	   * @param {function} callback A callback function that will be executed if success
	   */
	  IDB.insert = function(table,item, callback) {

	    // Initiate a new transaction.
	    var transaction = db.transaction([table], 'readwrite');

	    // Get the datastore.
	    var objStore = transaction.objectStore(table);

	    // Create the datastore request.
	    var request = objStore.put(item);

	    // Handle a successful datastore put.
	    request.onsuccess = function(e) {
	      // Execute the callback function.
	      if(callback)
	      	callback(item);
	    };

	    // Handle errors.
	    request.onerror = IDB.onerror;
	  };


	  /**
	   * Delete a item.
	   * @param {int} code The keyPath (code) of the prodect item .
	   * @param {function} callback A callback function that will be executed if the 
	   *                            delete is successful.
	   */
	  IDB.delete = function(table,code, callback) {
	    var transaction = db.transaction([table], 'readwrite');
	    var objStore = transaction.objectStore(table);
	    
	    var request = objStore.delete(code);
	    
	    request.onsuccess = function(e) {
	      callback();
	    }
	    
	    request.onerror = function(e) {
	      console.log(e);
	    }
	  };

	  /**
	   * Delete a item.
	   * @param {int} code The keyPath (code) of the prodect item .
	   * @param {function} callback A callback function that will be executed if the 
	   *                            delete is successful.
	   */
	  IDB.count = function(table,callback) {
	    var transaction = db.transaction([table], 'readwrite');
	    var objStore = transaction.objectStore(table);
	    
	    var request = objStore.count();
	    
	    request.onsuccess = function(e) {
	      var count = e.target.result;
	      callback(count);
	    }
	    
	    request.onerror = function(e) {
	      console.log(e);
	    }
	  };


	  // Export the tDB object.
	  return IDB;
	}());
	return f;
	
})
.factory('Auth', function($http, $cookieStore){

    var accessLevels = routingConfig.accessLevels
        , userRoles = routingConfig.userRoles
        ,currentUser = { username: '', role: userRoles.public };
//        , currentUser = $cookieStore.get('user') || { username: '', role: userRoles.public };
//cookie or chrome storage
//    $cookieStore.remove('user');

    function changeUser(user) {
        jQuery.extend(currentUser, user);
    };

    return {
        authorize: function(accessLevel, role) {
        	//console.log("auth: " + currentUser.role);
            if(role === undefined)
                role = currentUser.role;
            return accessLevel.bitMask & role.bitMask;
        },
        isLoggedIn: function(user) {
            if(user === undefined)
                user = currentUser;
            return user.role.title == userRoles.user.title || user.role.title == userRoles.admin.title;
        },
        register: function(user, success, error) {
            $http.post('/register', user).success(function(res) {
                changeUser(res);
                success();
            }).error(error);
        },
        login: function(user, success, error) {
            if(user.username=='test'&&user.password=='test')
            {
                user.role = userRoles.admin;
                user.value = user.username;
                user.dbname = 'test';
                changeUser(user);
                if(user.auto==true)
                {
                  chrome.storage.local.set({"user": user});
                }
                else
                {
                  chrome.storage.local.set({"user": null});
                }      
            }
            if(currentUser.role==userRoles.admin)
            {
            	success(user);
            }
            else
            {
                error();
            }
            /*
            $http.post('/login', user).success(function(user){
                changeUser(user);
                success(user);
            }).error(error);
            */
        },
        logout: function(success, error) {
        	chrome.storage.local.set({"user": null});
    	    changeUser({
                username: '',
                role: userRoles.public
            });
            $location.path('/login');
            /*
            $http.post('/logout').success(function(){

                success();
            }).error(error);
			*/
        },
        accessLevels: accessLevels,
        userRoles: userRoles,
        user: function(u){
        	if(u)
        	{
        		changeUser(u);
        	}
        	return currentUser;
        } 
    };
});