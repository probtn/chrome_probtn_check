var startButton = document.getElementById("start");
var stopButton = document.getElementById("stop");
var messageContainer = document.getElementById("messages");
var status_code = document.getElementById("status_code");
var status_button = document.getElementById("status_button");
var clearButton = document.getElementById("clear");

/**
 * Get the current URL.
 *
 * @param {function(string)} callback - called when the URL of the current tab
 *   is found.
 */
function getCurrentTabUrl(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    // chrome.tabs.query invokes the callback with a list of tabs that match the
    // query. When the popup is opened, there is certainly a window and at least
    // one tab, so we can safely assume that |tabs| is a non-empty array.
    // A window can only have one active tab at a time, so the array consists of
    // exactly one tab.
    var tab = tabs[0];

    // A tab is a plain object that provides information about the tab.
    // See https://developer.chrome.com/extensions/tabs#type-Tab
    var url = tab.url;

    // tab.url is only available if the "activeTab" permission is declared.
    // If you want to see the URL of other tabs (e.g. after removing active:true
    // from |queryInfo|), then the "tabs" permission is required to see their
    // "url" properties.
    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url);
  });

  // Most methods of the Chrome extension APIs are asynchronous. This means that
  // you CANNOT do something like this:
  //
  // var url;
  // chrome.tabs.query(queryInfo, function(tabs) {
  //   url = tabs[0].url;
  // });
  // alert(url); // Shows "undefined", because chrome.tabs.query is async.
}

function renderPage(pageText) {
  document.getElementById('page').textContent = pageText;
}

function renderStatus(statusText, code) {
  status_code = document.getElementById("status_code");
  status_button = document.getElementById("status_button");

  if (code===1) {
    status_code.textContent = statusText;
  }
  if (code===2) {
    status_button.textContent = statusText;
  }
  
}

document.addEventListener('DOMContentLoaded', function() {
  chrome.browserAction.setIcon({ path: "icon.png" });
  startButton = document.getElementById("start");
  stopButton = document.getElementById("stop");
  messageContainer = document.getElementById("messages");
  status_code = document.getElementById("status_code");
  status_button = document.getElementById("status_button");
  clearButton = document.getElementById("clear");

  getCurrentTabUrl(function(url) {
    renderPage(url);
  });

  startButton.addEventListener("click", function (e) {
    chrome.browserAction.setIcon({ path: "images/icon_enabled.png" });
    console.log("start clicked");
    sendMessage({message:"start"});
  });

  stopButton.addEventListener("click", function (e) {
    chrome.browserAction.setIcon({ path: "icon.png" });
    console.log("stop clicked");
    sendMessage({message:"stop"});
  });

  clearButton.addEventListener("click", function (e) {
    messageContainer.innerHTML = '';
    status_code.innerHTML = '';
    status_button.innerHTML = '';
    console.log("clear clicked");
    sendMessage({message:"stop"});
  });
});

var addToMessagesList = function(message) {
  var item = document.createElement('p');

  var currentdate = new Date();
  var datetime = currentdate.getHours() + ":" 
  + currentdate.getMinutes() + ":" + currentdate.getSeconds();

  item.innerHTML = "<span><i>"+datetime+"</i></span> " +message;
  if ((messageContainer===null) || (messageContainer===undefined)) {
    document.getElementById("messages");
  }
  try {
    messageContainer.appendChild(item);
  } catch(ex) {
    console.log(ex);
  }  
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    console.log("request", request);
    addToMessagesList(request.message);

    //if buttno find at current page
    if (request.find === true) {
      chrome.browserAction.setIcon({ path: "images/icon_found.png" });
      renderStatus("button found", request.code);
    }
});

//send message to current tab
var sendMessage = function(message) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {message}, function(response) {
      console.log(response);
      //addToMessagesList(response);
    });
  });
}

