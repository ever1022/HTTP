var http = require("http");
var logger = require("./logger");

function start(route) {
    function onRequest(request, response) {
        route(request, response);
    }
    http.createServer(onRequest).listen(8888);
    logger.i("Node.js HTTP server has started.");
}

exports.start = start;
