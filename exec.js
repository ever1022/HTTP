var exec = require("child_process").exec;

function run(cmd, callback) {
    exec(
        cmd, 
        function(error, stdout, stderr) {
            callback(stdout);
        }
    );
}

function listFiles(callback) {
    console.log("List files command was called.");
    var content = "Empty";
    
    exec(
        "ls -lah", 
        function(error, stdout, stderr) {
            content = stdout;
            callback(content);
        }
    );
}

exports.listFiles = listFiles;
exports.run = run;
