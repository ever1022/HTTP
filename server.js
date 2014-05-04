var http = require("http");
var connect = require("connect");
var socketIO = require("socket.io");
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
    var app = connect();
    app.use(onRequest);
    var httpServer = http.createServer(app).listen(8888);
    logger.i("Node.js HTTP server has started.");

    var webSocket = socketIO.listen(httpServer);
    webSocket.on(
        "connection",
        function(socket) {
            logger.i("Socket is connected.");
            socket.on(
                'addme',
                function(username) {
                    socket.username = username;
                    socket.emit('chat', 'SERVER', 'You have connected');
                    socket.broadcast.emit('chat', 'SERVER', username + ' is on deck');
                }
            );
            socket.on(
                'sendchat',
                function(data) { 
                    socket.emit('chat', socket.username, data);
                    socket.broadcast.emit('chat', socket.username, data);
                 }
            );

            socket.on(
                'disconnect',
                function() {
                    socket.emit('chat', 'SERVER', socket.username + ' has left the building');
                }
            );
        }
    );
}

exports.start = start;
