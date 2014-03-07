var fs = require("fs");
var requestHandlers = require("./requestHandlers");

function route(pathName, response) {
    console.log("About to route a request for " + pathName);
    
    if(pathName !== "/" && pathName.length !== 0) {
        if(pathName.substring(0,1) === "/") {
            pathName = pathName.substring(1, pathName.length + 1);
        }
        var fileStats = fs.statSync(pathName);
        if(fileStats.isDirectory()) {
            console.log("A directory is requested...");
            requestHandlers.files(pathName, response);
        } else if (fileStats.isFile()) {
            console.log("A file is requested...");
            requestHandlers.openFile(pathName, response);
        }
        return;
    } 

    console.log("Cannot handle the path!");
    response.writeHead(404, {"Content-Type": "text/plain"});
    response.write("404 Not Found!");
    response.end();
}

exports.route = route;
