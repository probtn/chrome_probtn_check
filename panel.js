function do_something(msg) {
    document.body.textContent += '\n' + msg; // Stupid example, PoC
}
document.documentElement.onclick = function() {
    // No need to check for the existence of `respond`, because
    // the panel can only be clicked when it's visible...
    respond('Another stupid example!');
};

/*chrome.devtools.network.onRequestFinished.addListener(
          function(request) {
            //if (request.response.bodySize > 40*1024) {
              chrome.devtools.inspectedWindow.eval(
                  'console.log("Large image: " + unescape("' +
                  escape(request.request.url) + '"))');
              console.log("request", request);
            //}
          respond(request);
});*/

