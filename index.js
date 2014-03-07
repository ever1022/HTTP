var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {};
handle["/"] = requestHandlers.textArea;
handle["/index"] = requestHandlers.index;
handle["/upload"] = requestHandlers.upload;
handle["/files"] = requestHandlers.files;
handle["openFile"] = requestHandlers.openFile;

server.start(router.route, handle);
