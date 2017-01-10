console.log("exist.js started");

function isMyScriptLoaded(url) {
    if (!url) url = "https://cdn.probtn.com/probtn.js";
    var scripts = document.getElementsByTagName('script');
    for (var i = scripts.length; i--;) {
        if (scripts[i].src == url) return true;
    }
    return false;
}

if (isMyScriptLoaded("https://cdn.probtn.com/probtn.js")) {
    console.log("https://cdn.probtn.com/probtn.js loaded");
};
if (isMyScriptLoaded("http://cdn.probtn.com/probtn.js")) {
    console.log("http://cdn.probtn.com/probtn.js loaded");
};
if (isMyScriptLoaded("https://cdn.probtn.com/includepb.min.js")) {
    console.log("https://cdn.probtn.com/includepb.min.js loaded");
};
if (isMyScriptLoaded("https://cdn.probtn.com/includepb.min.js")) {
    console.log("https://cdn.probtn.com/includepb.min.js loaded");
};
if (isMyScriptLoaded("https://cdn.probtn.com/probtn_full.js")) {
    console.log("https://cdn.probtn.com/probtn_full.js loaded");
};
if (isMyScriptLoaded("https://cdn.probtn.com/showinparent.js")) {
    console.log("https://cdn.probtn.com/showinparent.js loaded");
};
if (isMyScriptLoaded("https://cdn.probtn.com/showinparent_concat.js")) {
    console.log("https://cdn.probtn.com/showinparent_concat.js loaded");
};
if (isMyScriptLoaded("https://cdn.probtn.com/probtn_concat.js")) {
    console.log("https://cdn.probtn.com/probtn_concat.js loaded");
};

if (document.getElementById('probtn_button') !== null && document.getElementById('probtn_button') !== undefined) {
    console.log("#probtn_button exist at page after timeout");
} else {
    setTimeout(function () {
        if (document.getElementById('probtn_button') !== null && document.getElementById('probtn_button') !== undefined) {
            console.log("#probtn_button exist at page after timeout");
        } else {
            
        };

    }, 4000);
}