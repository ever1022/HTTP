var exec = require("./exec");

exec.run(
    "clear",
    function (output) {
        console.log("clear callback!")
        console.log(output);
    }
);

exec.listFiles(
    function (output) {
        console.log("listFiles callback!")
        console.log(output);
    }
);

exec.run(
    "ls -a",
    function (output) {
        console.log("ls -a callback!")
        console.log(output);
    }
);
