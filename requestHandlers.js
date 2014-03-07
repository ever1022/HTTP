var exec = require("child_process").exec;
var fs = require("fs");

function textArea(response) {
    console.log("Request handler for 'TextArea' was called.");
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
    console.log("Request handler for 'upload' was called.");
    response.writeHead(200, {"Content-Type" : "text/plain"});
    response.write("upload");
    response.end();
}

function slides(response) {
    console.log("Request handler for 'slides' was called");
}

function files(path, response) {
    console.log("Show " + path + " files... ");
    var cmd = "ls -lh " + path;
    exec(
        cmd,
        function(error, stdout, stderr) {
            response.writeHead(200, {"Content-Type" : "text/plain"});
            response.write(stdout);
            response.end();
        }
    );
}


function openFile(path, response) {
    console.log("Open file " + path + " ...");
    if(! fs.existsSync(path)) {
        console.log("File " + path + " doesn't exist");
        return false;
    } else {
        fs.readFile(
            path,
            "utf8",
            function(err, file) {
                response.writeHead(200, {"ContentType": "text/html"});
                response.write(file);
                response.end();
            }
        );
        return true;
    }
}

exports.files = files;
exports.openFile = openFile;
