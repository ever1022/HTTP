var http = require("http");
var url = require("url");

function start(route) {
    function onRequest(request, response) {
        var pathName = url.parse(request.url).pathname;
        console.log("Request for " + pathName + " received.");
        route(pathName, response);
    }
    http.createServer(onRequest).listen(8888);
    console.log("Node.js HTTP server has started.");
}

exports.start = start;
