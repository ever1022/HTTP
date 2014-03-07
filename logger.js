var winston = require("winston");

var fileLogger = new (winston.Logger) (
    {
        transports: [
            new (winston.transports.File) ({"filename": "server.log"})
        ]
    }
);

var consoleLogger = new (winston.Logger) (
    {
        transports: [
            new (winston.transports.Console) ()
        ]
    }
);

function v(message) {
    consoleLogger.info(message);
}

function i(message) {
    consoleLogger.info(message);
    fileLogger.info(message);
}

function w(message) {
    consoleLogger.warn(message);
    fileLogger.warn(message);
}

function e(message) {
    consoleLogger.error(message);
    fileLogger.error(message);
}

exports.v = v;
exports.i = i;
exports.w = w;
exports.e = e;
