var fs = require("fs");

function route(handle, pathName, response) {
    console.log("About to route a request for " + pathName);
    
    if(pathName.substring(0,1) === "/") {
        pathName = pathName.substring(1, pathName.length + 1);
    }
    var fileStats = fs.statSync(pathName);
    if(fileStats.isDirectory()) {
        console.log("A directory is requested...");
    } else if (fileStats.isFile()) {
        console.log("A file is requested...");
    } else {

        if(typeof handle[pathName] === 'function') {
            handle[pathName](response);
        } else {
            console.log("No request handler found!");
            response.writeHead(404, {"Content-Type": "text/plain"});
            response.write("404 Not Found!");
            response.end();
        }
    }
}

exports.route = route;
