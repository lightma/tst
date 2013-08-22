chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('index.html', {
//	  state : "maximized"
	  minWidth : 1024,
	  minHeight : 768,
    "bounds": {
      "width": 1024,
      "height": 768
    }
  });
});