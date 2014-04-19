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

function v(tag, message) {
    var args = arguments;
    switch(arguments.length) {
        case 2:
            logV("[" + arguments[0] + "] " + arguments[1]);
            break;
        default:
            logV(arguments[0]);
    }
}

function logV(message) {
    consoleLogger.info(message);
}

function i(tag, message) {
    var args = arguments;
    switch(arguments.length) {
        case 2:
            logI("[" + arguments[0] + "] " + arguments[1]);
            break;
        default:
            logI(arguments[0]);
    }
}

function logI(message) {
    consoleLogger.info(message);
    fileLogger.info(message);
}

function w(tag, message) {
    var args = arguments;
    switch(arguments.length) {
        case 2:
            logW("[" + arguments[0] + "] " + arguments[1]);
            break;
        default:
            logW(arguments[0]);
    }
}

function logW(message) {
    consoleLogger.warn(message);
    fileLogger.warn(message);
}

function e(tag, message) {
    var args = arguments;
    switch(arguments.length) {
        case 2:
            logE("[" + arguments[0] + "] " + arguments[1]);
            break;
        default:
            logE(arguments[0]);
    }
}

function logE(message) {
    consoleLogger.error(message);
    fileLogger.error(message);
}

exports.v = v;
exports.i = i;
exports.w = w;
exports.e = e;
