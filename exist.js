var sendMessage = function(message, find, code) {
    console.log("sendMessage "+ message);
    chrome.runtime.sendMessage({message: message, find: find, code: code}, function(response) {
        console.log(response);
    });
}

var isStarted = false;
var isFinished = false;
var isPopupOpen = false;
var buttonWaitTimeout = 7000;

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    console.log("request",request);
    if (request.message.message === "start") {
        if (isFinished === true) {
            isStarted = false;
            isFinished = false;
        }
        console.log("starting checkButtonExistOnPage");
        console.log("isStarted",isStarted);
        checkButtonExistOnPage();
    }

      if (request.message.message === "stop")
      {
        isFinished = true;
      }

     if (request.message.message === "popup_open")
     {
       isPopupOpen = true;
     }

     if (request.message.message === "save_options")
     {
       console.log("save_options");
       if ((request.message.bwt !== null) && (request.message.bwt !== undefined)
     && (request.message.bwt > 0))
      {
        buttonWaitTimeout = request.message.bwt;
        console.log("buttonWaitTimeout: " + buttonWaitTimeout);
      }
     }
});

function isMyScriptLoaded(url) {
    if (!url) url = "https://cdn.probtn.com/probtn.js";
    var scripts = document.getElementsByTagName('script');
    for (var i = scripts.length; i--;) {
        if (scripts[i].src == url) return true;
    }
    return false;
}

function sendDataToPopup(message, isFound, code)
{
  if (isPopupOpen === true)
  {
    console.log(message);
    sendMessage(message, isFound, code);
  }
  else
  {
    var data = {
      "message": message,
      "find": isFound,
      "code": code
    };

    var name = null;
    if (code === 1)
    {
      chrome.storage.local.set({"button_code": data}, function(){console.log("button_code save");});
    }
    else {
      chrome.storage.local.set({"button": data}, function(){console.log("button save");});
    }
  }
}

sendMessage("exist.js ready", false, 4);

var checkButtonExistOnPage = function() {
    if (isStarted === false) {
        isStarted = true;

        console.log("exist.js started");
        var data = {
          message: null,
          find: null,
          code: null
        };


        if (isMyScriptLoaded("https://cdn.probtn.com/probtn.js")) {
            sendDataToPopup("https://cdn.probtn.com/probtn.js loaded", true, 1);
        };
        if (isMyScriptLoaded("http://cdn.probtn.com/probtn.js")) {
            sendDataToPopup("http://cdn.probtn.com/probtn.js loaded", true, 1);
        };
        if (isMyScriptLoaded("https://cdn.probtn.com/includepb.min.js")) {
            sendDataToPopup("https://cdn.probtn.com/includepb.min.js loaded", true, 1);
        };
        if (isMyScriptLoaded("https://cdn.probtn.com/includepb.min.js")) {
            sendDataToPopup("https://cdn.probtn.com/includepb.min.js loaded", true, 1);
        };
        if (isMyScriptLoaded("https://cdn.probtn.com/probtn_full.js")) {
            sendDataToPopup("https://cdn.probtn.com/probtn_full.js loaded", true, 1);
        };
        if (isMyScriptLoaded("https://cdn.probtn.com/showinparent.js")) {
            sendDataToPopup("https://cdn.probtn.com/showinparent.js loaded", true, 1);
        };
        if (isMyScriptLoaded("https://cdn.probtn.com/showinparent_concat.js")) {
            setData("https://cdn.probtn.com/showinparent_concat.js loaded", true, 1);
        };
        if (isMyScriptLoaded("https://cdn.probtn.com/probtn_concat.js")) {
            sendDataToPopup("https://cdn.probtn.com/probtn_concat.js loaded", true, 1);
        };

        if (document.getElementById('probtn_button') !== null && document.getElementById('probtn_button') !== undefined) {
            sendDataToPopup("#probtn_button exist at page after timeout", true, 2);
        } else {
            setTimeout(function () {
                if (document.getElementById('probtn_button') !== null && document.getElementById('probtn_button') !== undefined) {
                    sendDataToPopup("#probtn_button exist at page after timeout", true, 2);
                } else {
                    sendDataToPopup("#probtn_button not found", false, 3);
                };
                isFinished = true;
            }, buttonWaitTimeout);
        }


    }
}

chrome.storage.local.get(null, function(items) {
  console.log("items", items);
  if ((items.buttonWaitTimeout !== undefined) && (items.buttonWaitTimeout !== null)
   && (items.buttonWaitTimeout > 0))
  {
    buttonWaitTimeout = items.buttonWaitTimeout;
  }

  chrome.storage.local.get("auto", function(startMode) {
    if (startMode.auto === true)
    {
      chrome.runtime.sendMessage({message: "setIconEnable"});
      checkButtonExistOnPage();
    }
  });

});
