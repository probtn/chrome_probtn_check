var currentTab = "";
var tabId = 0;

// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
  // No tabs or host permissions needed!
  console.log('Turning ' + tab.url + ' red!');
  chrome.tabs.executeScript({
    code: 'document.body.style.backgroundColor="red"'
  });
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	/*console.log("changeInfo", changeInfo);
	console.log("tabId", tabId);
	console.log("tab", tab);
	if ((changeInfo.url!==null) && (changeInfo!==undefined)) {
		if (currentTab!==changeInfo.url) {
			chrome.browserAction.setIcon({ path: "icon.png" });
		}
	}*/
});

chrome.tabs.onActivated.addListener(function(tabId, changeInfo, tab) {
	console.log("changeInfo2", changeInfo);
	console.log("tabId2", tabId);
	console.log("tab2", tab);

	if ((tabId.tabId!==null) && (tabId.tabId!==undefined)) {
		if (tabId!==tabId.tabId) {
			chrome.browserAction.setIcon({ path: "icon.png" });
		}
	}
});

var ports = [];
chrome.runtime.onConnect.addListener(function(port) {
    if (port.name !== "devtools") return;
    ports.push(port);
    // Remove port when destroyed (eg when devtools instance is closed)
    port.onDisconnect.addListener(function() {
        var i = ports.indexOf(port);
        if (i !== -1) ports.splice(i, 1);
    });
    port.onMessage.addListener(function(msg) {
        // Received message from devtools. Do something:
        console.log('Received message from devtools page', msg);
    });
});
// Function to send a message to all devtools.html views:
function notifyDevtools(msg) {
    ports.forEach(function(port) {
        port.postMessage(msg);
    });
}

//long live cinnection to popup page
chrome.extension.onConnect.addListener(function(port) {
	console.log("Connected .....");
    port.onMessage.addListener(function(msg) {
    	console.log("message recieved" + msg.currentTab);
    	console.log("tab", msg.tab);
    	currentTab = msg.currentTab;
    	tabId = msg.tab.id;
    	//port.postMessage("Hi Popup.js");
    });
});