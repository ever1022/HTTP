var server = require("./server");
var router = require("./router");
var polyfiller = require("./polyfiller");

polyfiller.run();
server.start(router.route);
