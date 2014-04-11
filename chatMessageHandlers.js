var url = require("url");
var querystring = require("querystring");
var logger = require("./logger");

function getMessage(request, response) {
    var since = querystring.parse(url.parse(request.url).query).since;
    logger.v("Get messages since " + since + ".");
}

function sendMessage(request, response) {
    logger.v("Send messages ");
    var json = "";
    if(request.method === "POST") {
        request.body = "";
        request.addListener(
            "data",
            function(chunk) {
                request.body = request.body + chunk;
            }
        );
        request.addListener(
            "end",
            function() {
                json = JSON.stringify(querystring.parse(request.body));
                //save doc to mongodb
            }
        );
    }
}

function login() {
}

exports.getMessage = getMessage;
exports.sendMessage = sendMessage;
