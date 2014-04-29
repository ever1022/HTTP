var exec = require("child_process").exec;
var fs = require("fs");
var logger = require("./logger");
var path = require("path");
var mime = require("mime");
var TAG = "requestHandlers";

function textArea(response) {
    logger.i(TAG, "Request handler for 'TextArea' was called.");
    var body = 
        '<html>' +
            '<head>' +
                '<meta http-equiv="Content-Type" content="text/html;" charset="UTF-8"/>' +
            '</head>' +
            '<body>' +
                '<form action="/upload" method="post">' +
                    '<textarea name="text" rows="1" cols="10"></textarea>' +
                    '<input type="submit" value="Submit text" />' +
                '</form>' +
            '</body>' +
        '</html>';
    response.writeHead(200, {"Content-Type" : "text/html"});
    response.write(body);
    response.end();
}

function upload(response) {
    logger.i(TAG, "Request handler for 'upload' was called.");
    response.writeHead(200, {"Content-Type" : "text/plain"});
    response.write("upload");
    response.end();
}

function slides(response) {
    logger.i(TAG, "Request handler for 'slides' was called.");
}

function files(pathName, response) {
    logger.i(TAG, "Show " + pathName + " files... ");
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
    logger.i(TAG, "Show " + pathName + " files... ");
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
                var preLinkPath = "/" + pathName;
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
    logger.i(TAG, "Open file " + pathName + ", mime type: " + mime.lookup(pathName));
    var mimeType = mime.lookup(pathName).toString();
    if(mimeType.startsWith("image")) {
        return openImageFile(pathName, response);
    } else if(mimeType == "text/plain") {
        openTextPlainFile(pathName, response);
    }
 
    if(! fs.existsSync(pathName)) {
        logger.w(TAG, "File " + pathName + " doesn't exist!");
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

function openImageFile(pathName, response) {
    logger.v(TAG, "Open an image file.");
    if(! fs.existsSync(pathName)) {
        logger.w(TAG, "File " + pathName + " doesn't exist!");
        return false;
    } else {
        fs.readFile(
            pathName,
            "binary",
            function(err, data) {
                if(err) {
                    response.writeHead(500, {"Content-Type": "text/plain"});
                    response.write(error + "\n");
                    response.end();
                } else {
                    response.writeHead(200, {"ContentType": mime.lookup(pathName)});
                    response.write(data, "binary");
                    response.end();
                }
            }
        );
        return true;
    }
}

function openTextPlainFile(pathName, response) {
    logger.v(TAG, "Open a plain text file.");
    if(! fs.existsSync(pathName)) {
        logger.w(TAG, "File " + pathName + " doesn't exist!");
        return false;
    } else {
        fs.readFile(
            pathName,
            "utf8",
            function(err, data) {
                if(err) {
                    response.writeHead(500, {"Content-Type": "text/plain"});
                    response.write(error + "\n");
                    response.end();
                } else {
                    response.writeHead(200, {"Content-Type": "text/plain"});
                    response.write(data);
                    response.end();
                }
            }
        );
        return true;
    }
}

function openMarkdownInRevealjs(pathName, response) {
    logger.i(TAG, "Open markdown file " + pathName + " with reveal.js...");
    if(! fs.existsSync(pathName)) {
        logger.w(TAG, "File " + pathName + " doesn't exist!");
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

function requestUserId(response) {
    var session = "session = " + makeSessionId();
    fs.readFile(
        "html/auth/idrequest.html",
        "utf8",
        function(err, data) {
            response.writeHead(200, {"ContentType": "text/html", "Set-Cookie" : session});
            response.write(data);
            response.end();
        }
    );
}

function requestCredential(userId, response) {
    var cookies = "user=" + userId;
    fs.readFile(
        "html/auth/credentialrequest.html",
        "utf8",
        function(err, data) {
            response.writeHead(200, {"ContentType": "text/html", "Set-Cookie" : cookies});
            response.write(data);
            response.end();
        }
    );
}

function makeSessionId() {
    var sessionId = "SID" + new Date().getTime();
    return sessionId;
}

function setCookies(response) {
    logger.v(TAG, "setCookies");
    var cookies = "expires = " + new Date().getTime() + 20 * 60 * 1000;
    response.writeHead(200, {"Set-Cookie" : cookies});
    response.end();
}

exports.files = files;
exports.openFile = openFile;
exports.filesToHtml = filesToHtml;
exports.openMarkdownInRevealjs = openMarkdownInRevealjs;
exports.requestUserId = requestUserId;
exports.requestCredential = requestCredential;
exports.setCookies = setCookies;
exports.textArea = textArea;
