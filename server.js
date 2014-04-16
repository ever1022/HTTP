var http = require("http");
var logger = require("./logger");
var router = require("./router");

function start(route) {
    function onRequest(request, response) {
	var postData = "";
	request.addListener(
	    "data",
            function(postDataChunk) {
		postData += postDataChunk;
	    }
	);

	request.addListener(
	    "end",
	    function() {
        	route(request, response, postData);
	    }
	);
    }
    http.createServer(onRequest).listen(8888);
    logger.i("Node.js HTTP server has started.");
}

exports.start = start;
