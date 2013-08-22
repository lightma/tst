/**
 * @file A module for interacting with the DB.
 * @author Matt West <matt.west@kojilabs.com>
 * @license MIT {@link http://opensource.org/licenses/MIT}.
 */

var productsDB = (function() {
  var tDB = {};
  var datastore = null;

  /**
   * Open a connection to the datastore.
   */
  tDB.open = function(callback) {
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
    var request = indexedDB.open('myapp', version);

    // Handle datastore upgrades.
    request.onupgradeneeded = function(e) {
      var db = e.target.result;

      e.target.transaction.onerror = tDB.onerror;
      //db.deleteObjectStore('products');
      // Delete the old datastore.
      if (db.objectStoreNames.contains('products')) {
        db.deleteObjectStore('products');
      }

      // Create a new datastore.
      var store = db.createObjectStore('products', {
        keyPath: 'code'
      });
      store.createIndex("typeIndex", "type", { unique: false });
    };

    // Handle successful datastore access.
    request.onsuccess = function(e) {
      // Get a reference to the DB.
      datastore = e.target.result;
      
      // Execute the callback.
      callback();
    };

    // Handle errors when opening the datastore.
    request.onerror = tDB.onerror;
  };


  /**
   * Fetch all of the items in the datastore.
   * @param {function} callback A function that will be executed once the items
   *                            have been retrieved. Will be passed a param with
   *                            an array of the  items.
   */
  tDB.fetchAll = function(callback) {
    var db = datastore;
    var transaction = db.transaction(['products'], 'readwrite');
    var objStore = transaction.objectStore('products');
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

    cursorRequest.onerror = tDB.onerror;
  };

  /**
   * Fetch items by index in the datastore.
   * @param {function} callback A function that will be executed once the items
   *                            have been retrieved.
   */
  tDB.fetchItemsByIndex = function(key,value,callback) {
    var db = datastore;
    var transaction = db.transaction(['products'], 'readwrite');
    var objStore = transaction.objectStore('products');
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
    cursorRequest.onerror = tDB.onerror;
  };

  /**
   * Fetch one item by keypath in the datastore.
   * @param {function} callback A function that will be executed once the item
   *                            have been retrieved. Will be passed a param with
   *                            an obj .
   */
  tDB.fetchOne = function(code,callback) {
    var db = datastore;
    var transaction = db.transaction(['products'], 'readwrite');
    var objStore = transaction.objectStore('products');
    var request = objStore.get(code);
    request.onsuccess = function(e) {
      var item = e.target.result;
      callback(item);
    };
    request.onerror = tDB.onerror;
  };


  /**
   * @param {obj} item to be deleted.
   * @param {function} callback A callback function that will be executed if success
   */
  tDB.insert = function(item, callback) {
    // Get a reference to the db.
    var db = datastore;

    // Initiate a new transaction.
    var transaction = db.transaction(['products'], 'readwrite');

    // Get the datastore.
    var objStore = transaction.objectStore('products');

    // Create the datastore request.
    var request = objStore.put(item);

    // Handle a successful datastore put.
    request.onsuccess = function(e) {
      // Execute the callback function.
      callback(item);
    };

    // Handle errors.
    request.onerror = tDB.onerror;
  };


  /**
   * Delete a item.
   * @param {int} code The keyPath (code) of the prodect item .
   * @param {function} callback A callback function that will be executed if the 
   *                            delete is successful.
   */
  tDB.delete = function(code, callback) {
    var db = datastore;
    var transaction = db.transaction(['products'], 'readwrite');
    var objStore = transaction.objectStore('products');
    
    var request = objStore.delete(code);
    
    request.onsuccess = function(e) {
      callback();
    }
    
    request.onerror = function(e) {
      console.log(e);
    }
  };


  // Export the tDB object.
  return tDB;
}());
