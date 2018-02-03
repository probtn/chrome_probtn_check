var startButton = null;
var startOnceButton = null;
var stopButton = null;
var messageContainer = null;
var status_code = null;
var status_button = null;
var clearButton = null;
var status_current_step = null;
var status_current_time = null;
var switchCheckbox = null;
var currentTimer = null;
var currentTimerValue = 0;

var buttonWaitTimeout = 7000;
var cycleCount = 7;
var isFound = false;
var currentCount = 0;

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

  //  port.postMessage({currentTab: url, tab: tab});

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

function renderStatusCode(statusText, code) {
  if (code===1) {
    //status_code.textContent = statusText;
    status_code.className += " show";
  }
  if (code===2) {
    //status_button.textContent = statusText;
    status_button.className += " show";
  }
}

function renderCurrentStep(step) {
  status_current_step = document.getElementById("status_current_step");
  status_current_step.textContent = step;
}

function renderCurrentTime(time) {
  status_current_time = document.getElementById("status_current_time");

  var msToString = function(time) {
    var currentdate = new Date(time);
    var minutes = currentdate.getMinutes();
    if (minutes<10) {
      minutes = "0"+minutes;
    }
    var seconds = currentdate.getSeconds();
    if (seconds<10) {
      seconds = "0"+seconds;
    }
    var datetime = minutes + ":" + seconds + ":" + currentdate.getMilliseconds();
    return datetime;
  }

  status_current_time.textContent = msToString(time);
}

function renderStatus(message) {
  /*var status = document.getElementById("status");
  status.textContent = message;*/
}

function startTimer() {
  currentTimerValue = 0;
  renderCurrentTime(currentTimerValue);
  currentTimer = setInterval(function() {
    currentTimerValue = currentTimerValue + 5;
    renderCurrentTime(currentTimerValue);
  }, 5);
}

function restartTimer() {
  stopTimer(function() {
    startTimer();
  });
}

function stopTimer(callback) {
  if ((currentTimer!==null) && (currentTimer!==undefined)) {
    clearInterval(currentTimer);
    if ((callback!==null) && (callback!==undefined)) {
      callback();
    }
  }
}

document.addEventListener('DOMContentLoaded', function() {
  chrome.browserAction.setIcon({ path: "icon.png" });
  startButton = document.getElementById("start");
  stopButton = document.getElementById("stop");
  console.log("stopButton", stopButton);
  startOnceButton = document.getElementById("startOnce");
  messageContainer = document.getElementById("messages");
  status_code = document.getElementById("status_code_block");
  status_button = document.getElementById("status_button_block");
  clearButton = document.getElementById("clear");
  status_current_step = document.getElementById("status_current_step");
  switchCheckbox = document.getElementById("switch");


  getCurrentTabUrl(function(url) {
    renderPage(url);
  });

  chrome.storage.sync.get(null, function(items) {
    console.log("items", items);
    if ((items.buttonWaitTimeout!==undefined) && (items.buttonWaitTimeout!==null)
      && (items.cycleCount!==undefined) && (items.cycleCount!==null)) {
      buttonWaitTimeout = items.buttonWaitTimeout;
      cycleCount = items.cycleCount;
    } else {
    }

    document.getElementById('buttonWaitTimeout').textContent = buttonWaitTimeout;
    document.getElementById('cycleCount').textContent = cycleCount;

    startButton.addEventListener("click", function (e) {
      getCurrentTabUrl(function(url) {
        isFound = false;
        chrome.browserAction.setIcon({ path: "images/icon_enabled.png" });
        console.log("start clicked");

        messageContainer.innerHTML = '';
        //status_code.innerHTML = '';
        //status_button.innerHTML = '';
        status_code.classList.remove("show");
        status_button.classList.remove("show");

        renderStatus("started...");
        renderCurrentStep(currentCount);

        startTimer();

        sendMessage({message:"start"});
      });
    });

    stopButton.addEventListener("click", function (e) {
      chrome.browserAction.setIcon({ path: "icon.png" });
      console.log("stop clicked");
      renderStatus("stoped");

      cycleCount = cycleCount;
      isFound = true;

      stopTimer();

      sendMessage({message:"stop"});
    });

    clearButton.addEventListener("click", function (e) {
      messageContainer.innerHTML = '';
      status_code.innerHTML = '';
      status_button.innerHTML = '';
      currentCount = 0;
      isFound = false;

      renderCurrentStep(currentCount);
      renderCurrentTime(0);
      console.log("clear clicked");

      sendMessage({message:"stop"});
    });

    switchCheckbox.addEventListener("change", function (e) {
      chrome.storage.sync.set({"auto": true}, function(){});
    });

    chrome.storage.sync.get("auto", function(startMode) {
      if ((startMode.auto !== null) && (startMode.auto !== undefined) && (startMode.auto !== ""))
      {
        switchCheckbox.checked = startMode.auto;
      }
    });
});
});

var dateTimeToString = function(currentdate) {
  var minutes = currentdate.getMinutes();
  if (minutes<10) {
    minutes = "0"+minutes;
  }
  var seconds = currentdate.getSeconds();
  if (seconds<10) {
    seconds = "0"+seconds;
  }
  var datetime = currentdate.getHours() + ":" + minutes + ":" + seconds;
  return datetime;
}

var addToMessagesList = function(message) {
  var item = document.createElement('p');

  var currentdate = new Date();
  var datetime = dateTimeToString(currentdate);

  item.innerHTML = "<span class='message_time'>"+datetime+"</span> <span class='message_text'>" +message+"</span>";
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
      renderStatusCode("button found", request.code);
      isFound = true;

      renderStatus("found");

      stopTimer();
    }

    if (!isFound) {
      if (request.code === 3) {
        chrome.tabs.query({active: true, currentWindow: true}, function (arrayOfTabs) {
          //use settings from plugin
          if (currentCount<cycleCount) {
            stopTimer();
            currentCount++;
            renderCurrentStep(currentCount);
            addToMessagesList("reloading page ...");
            var code = 'window.location.reload();';
            chrome.tabs.executeScript(arrayOfTabs[0].id, {code: code});
          } else {
            stopTimer();
          }

        });
      }

      if (request.code === 4) {
        //chrome.tabs.query({active: true, currentWindow: true}, function (arrayOfTabs) {
          //use settings from plugin
          if (currentCount<cycleCount) {
            restartTimer();
            sendMessage({message:"start"});
          } else {
            stopTimer();
          }
        //});
      }
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
