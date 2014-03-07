var http = require("http");
var url = require("url");
var logger = require("./logger");

function start(route) {
    function onRequest(request, response) {
        var pathName = url.parse(request.url).pathname;
        logger.v("Request for " + pathName + " received.");
        route(pathName, response);
    }
    http.createServer(onRequest).listen(8888);
    logger.i("Node.js HTTP server has started.");
}

exports.start = start;
