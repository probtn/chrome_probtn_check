var defaultButtonWaitTimeout = 7000;
var defaultCycleCount = 7;

//apply options to nessesary fields
var setOptionsAtPage = function(options) {

}

var saveOptions = function() {
	try {
		var buttonWaitTimeout = parseInt(document.getElementById('buttonWaitTimeout').value);
		var cycleCount = parseInt(document.getElementById('cycleCount').value);
	} catch(ex) {
		buttonWaitTimeout = defaultButtonWaitTimeout;
		cycleCount = defaultCycleCount;
	}

	/*console.log("buttonWaitTimeout", buttonWaitTimeout);
	console.log("cycleCount", cycleCount);*/

	if (!Number.isInteger(buttonWaitTimeout)) buttonWaitTimeout = defaultButtonWaitTimeout;
	if (!Number.isInteger(cycleCount)) cycleCount = defaultCycleCount;

	/*console.log("buttonWaitTimeout", buttonWaitTimeout);
	console.log("cycleCount", cycleCount);*/

	chrome.storage.local.set({
		buttonWaitTimeout: buttonWaitTimeout,
		cycleCount: cycleCount
	}, function() {
	    // Update status to let user know options were saved.
	    var status = document.getElementById('status');
	    status.textContent = 'Options saved.';
	    setTimeout(function() {
			status.textContent = '';
    	}, 1750);
	});
}

function loadOptions() {
  // Use default value color = 'red' and likesColor = true.
  /*{
    buttonWaitTimeout: defaultButtonWaitTimeout,
    cycleCount: defaultCycleCount
  }*/
  chrome.storage.local.get(null, function(items) {
  	console.log("items", items);
  	if ((items.buttonWaitTimeout!==undefined) && (items.buttonWaitTimeout!==null)
  		&& (items.cycleCount!==undefined) && (items.cycleCount!==null)) {
  		document.getElementById('buttonWaitTimeout').value = items.buttonWaitTimeout;
  		document.getElementById('cycleCount').value = items.cycleCount;
  	} else {
  		restoreOptions();
  	}
  });
}

function initOptions() {
	loadOptions();
	document.getElementById('save').addEventListener('click', saveOptions);
	document.getElementById('restore').addEventListener('click', restoreOptions);
}

document.addEventListener('DOMContentLoaded', initOptions);

var restoreOptions = function() {
	document.getElementById('buttonWaitTimeout').value = defaultButtonWaitTimeout;
	document.getElementById('cycleCount').value = defaultCycleCount;
}
