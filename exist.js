var sendMessage = function(message, find, code) {
    console.log("sendMessage "+ message);
    chrome.runtime.sendMessage({message: message, find: find, code: code}, function(response) {
        console.log(response);
    });
}

var isStarted = false;

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    console.log("request",request);
    if (request.message.message == "start") {   
        checkButtonExistOnPage();
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

sendMessage("exist.js ready", false, 4);

var checkButtonExistOnPage = function() {
    if (isStarted === false) {
        isStarted = true; 

        console.log("exist.js started");

        if (isMyScriptLoaded("https://cdn.probtn.com/probtn.js")) {
            sendMessage("https://cdn.probtn.com/probtn.js loaded", true, 1);
        };
        if (isMyScriptLoaded("http://cdn.probtn.com/probtn.js")) {
            sendMessage("http://cdn.probtn.com/probtn.js loaded", true, 1);
        };
        if (isMyScriptLoaded("https://cdn.probtn.com/includepb.min.js")) {
            sendMessage("https://cdn.probtn.com/includepb.min.js loaded", true, 1);
        };
        if (isMyScriptLoaded("https://cdn.probtn.com/includepb.min.js")) {
            sendMessage("https://cdn.probtn.com/includepb.min.js loaded", true, 1);
        };
        if (isMyScriptLoaded("https://cdn.probtn.com/probtn_full.js")) {
            sendMessage("https://cdn.probtn.com/probtn_full.js loaded", true, 1);
        };
        if (isMyScriptLoaded("https://cdn.probtn.com/showinparent.js")) {
            sendMessage("https://cdn.probtn.com/showinparent.js loaded", true, 1);
        };
        if (isMyScriptLoaded("https://cdn.probtn.com/showinparent_concat.js")) {
            sendMessage("https://cdn.probtn.com/showinparent_concat.js loaded", true, 1);
        };
        if (isMyScriptLoaded("https://cdn.probtn.com/probtn_concat.js")) {
            sendMessage("https://cdn.probtn.com/probtn_concat.js loaded", true, 1);
        };

        if (document.getElementById('probtn_button') !== null && document.getElementById('probtn_button') !== undefined) {
            sendMessage("#probtn_button exist at page after timeout", true, 2);
        } else {
            setTimeout(function () {
                if (document.getElementById('probtn_button') !== null && document.getElementById('probtn_button') !== undefined) {
                    sendMessage("#probtn_button exist at page after timeout", true, 2);
                } else {
                    sendMessage("#probtn_button not found", false, 3);
                };

            }, 7000);
        }
    }
}

