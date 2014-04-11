var exec = require("child_process").exec;
var fs = require("fs");
var logger = require("./logger");
var path = require("path");

function textArea(response) {
    logger.i("Request handler for 'TextArea' was called.");
    var body = 
        '<html>' +
            '<head>' +
                '<meta http-equiv="Content-Type" content="text/html;" charset="UTF-8"/>' +
            '</head>' +
            '<body>' +
                '<form action="/upload" method="post">' +
                    '<textarea name="text" rows="20" cols="60"></textarea>' +
                    '<input type="submit" value="Submit text" />' +
                '</form>' +
            '</body>' +
        '</html>';
    response.writeHead(200, {"Content-Type" : "text/html"});
    response.write(body);
    response.end();
}

function upload(response) {
    logger.i("Request handler for 'upload' was called.");
    response.writeHead(200, {"Content-Type" : "text/plain"});
    response.write("upload");
    response.end();
}

function slides(response) {
    logger.i("Request handler for 'slides' was called.");
}

function files(pathName, response) {
    logger.i("Show " + pathName + " files... ");
    var cmd = "ls -lh " + pathName;
    exec(
        cmd,
        function(error, stdout, stderr) {
            response.writeHead(200, {"Content-Type" : "text/plain"});
            response.write(stdout);
            response.end();
        }
    );
}

function filesToHtml(pathName, response) {
    logger.i("Show " + pathName + " files... ");
    var cmd = "ls " + pathName;
    exec(
        cmd,
        function(error, stdout, stderr) {
	    var lines = stdout.toString().split('\n');
            response.writeHead(200, {"Content-Type" : "text/html"});
    	    var body = 
        	'<html>' +
            	'<head>' +
                    '<meta http-equiv="Content-Type" content="text/html;" charset="UTF-8"/>' +
            	'</head>' +
            	'<body>';
	    lines.forEach(function(line) {
                var preLinkPath = "http://localhost:8888/" + pathName;
	        if(preLinkPath.endsWith("/")) {
                    body = body +
                        line.link(preLinkPath + line) +
                        '<br>';
		} else {
                    body = body +
                        line.link(preLinkPath + "/" +  line) +
                        '<br>';
		}
	    });
	    bosy = body + 
            	'</body>' +
        	'</html>';
    	    response.write(body);
            response.end();
        }
    );
}


function openFile(pathName, response) {
    logger.i("Open file " + pathName + " ...");
    if(! fs.existsSync(pathName)) {
        logger.w("File " + pathName + " doesn't exist!");
        return false;
    } else {
        fs.readFile(
            pathName,
            "utf8",
            function(err, data) {
                response.writeHead(200, {"ContentType": "text/html"});
                response.write(data);
                response.end();
            }
        );
        return true;
    }
}

function openMarkdownInRevealjs(pathName, response) {
    logger.i("Open markdown file " + pathName + " with reveal.js...");
    if(! fs.existsSync(pathName)) {
        logger.w("File " + pathName + " doesn't exist!");
        return false;
    } else {
        var fileName = path.basename(pathName);
        fs.readFile(
            "slides/sample.html",
            "utf8",
            function(err, data) {
                var result = data.replace(/sample.md/g, fileName);
                response.writeHead(200, {"ContentType": "text/html"});
                response.write(result);
                response.end();
            }
        );
        return true;
    }
}

exports.files = files;
exports.openFile = openFile;
exports.filesToHtml = filesToHtml;
exports.openMarkdownInRevealjs = openMarkdownInRevealjs;
