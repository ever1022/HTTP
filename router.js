var fs = require("fs");
var url = require("url");
var requestHandlers = require("./requestHandlers");
var logger = require("./logger");

function route(request, response) {
    var pathName = url.parse(request.url).pathname;
    
    try {
        if(pathName === "/") {
            requestHandlers.files("", response);
            return;
        } else if(pathName.length !== 0) {
            if(pathName.substring(0,1) === "/") {
                pathName = pathName.substring(1, pathName.length + 1);
            }
            var fileStats = fs.statSync(pathName);
            if(fileStats.isDirectory()) {
                logger.v("A directory is requested...");
                requestHandlers.files(pathName, response);
            } else if (fileStats.isFile()) {
                if(pathName.endsWith(".md") && url.parse(request.url).query === "reveal.js") {
                    logger.v("Open markdwon with reveal.js...");
                    requestHandlers.openMarkdownInRevealjs(pathName, response);
                    return;
                }
                logger.v("A file is requested...");
                requestHandlers.openFile(pathName, response);
            }
            return;
        } 
    } catch (e) {
        logger.e("An exception was thrown " + e);
    }

    logger.w("Cannot handle the path " + pathName);
    response.writeHead(404, {"Content-Type": "text/plain"});
    response.write("404 Not Found!");
    response.end();
}

exports.route = route;
