var fs = require("fs");
var url = require("url");
var requestHandlers = require("./requestHandlers");
var logger = require("./logger");
var userDbHelper = require("./userDbHelper");
var myResultCodes = require("./myResultCodes");
var REQUEST_CREDENTIAL = "request_credential";
var TAG = "router";

function route(request, response, postData) {
    var pathName = url.parse(request.url).pathname;
    logger.v(TAG, "Request path " + pathName);
    if(request.headers.cookie == undefined) {
        logger.v(TAG, "Cookie is undefined.");
        if(pathName === "/checkUserId") {
            logger.v(TAG, "Check user id.");
    	    var userId = JSON.parse(postData)["userid"];
            userDbHelper.isUserExisted(
                userId,
                function callback(result) {
                    if(result == myResultCodes.TRUE) {
                        logger.v(TAG, "Request credential, user id: " + userId);
                        requestHandlers.requestCredential(userId, response);
                        //return;
                    } else {
                        logger.v(TAG, "User is not existed, request id again.");
                        requestHandlers.requestUserId(response);
                        //return;
                    }
                }
            );
        } else {
            logger.v(TAG, "Request user id.");
            requestHandlers.requestUserId(response);
            //return;
        }
        return;
    } else {
        logger.v(TAG, "Cookie: " + request.headers.cookie);
        if(pathName === "/checkCredential") {
            logger.v(TAG, "Check credential.");
    	    var userId = "ever";
    	    var userPw = JSON.parse(postData)["userpw"];
            userDbHelper.isUserPasswordCorrect(
                userId,
                userPw,
                function callback(result) {
                    if(result == myResultCodes.TRUE) {
            		requestHandlers.filesToHtml("", response);
                    } else {
                        logger.v(TAG, "Password isn't correct.");
                        requestHandlers.requestUserId(response);
                    }
                }
            );
	    return;
        }
    }
    
    try {
        if(pathName === "/") {
            requestHandlers.filesToHtml("", response);
            return;
        } else if(pathName.length !== 0) {
            if(pathName.substring(0,1) === "/") {
                pathName = pathName.substring(1, pathName.length + 1);
            }
            var fileStats = fs.statSync(pathName);
            if(fileStats.isDirectory()) {
                logger.v(TAG, "A directory is requested...");
                requestHandlers.filesToHtml(pathName, response);
            } else if (fileStats.isFile()) {
                if(pathName.endsWith(".md") && url.parse(request.url).query === "reveal.js") {
                    logger.v(TAG, "Open markdwon with reveal.js...");
                    requestHandlers.openMarkdownInRevealjs(pathName, response);
                    return;
                }
                logger.v(TAG, "A file is requested...");
                requestHandlers.openFile(pathName, response);
            }
            return;
        } 
    } catch (e) {
        logger.e(TAG, "An exception was thrown " + e);
    }

    logger.w(TAG, "Cannot handle the path " + pathName);
    response.writeHead(404, {"Content-Type": "text/plain"});
    response.write("404 Not Found!");
    response.end();
}

exports.route = route;
