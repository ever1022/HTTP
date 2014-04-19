var dbProvider = require("./dbProvider");
var logger = require("./logger");
var myResultCodes = require("./myResultCodes");
var TAG = "userDbHelper";

var host = "127.0.0.1";
var port = 27017;
var dbName = "test";
var dbProviderInstance;

function isUserExisted(userId, callback) {
    if(! dbProviderInstance) {
        dbProviderInstance = new dbProvider.dbProvider(host, port, dbName);
    }
    dbProviderInstance.getCollection(
        "test_collection",
        function(error, result) {
            if(error) {
                logger.e(TAG, error);
                callback(myResultCodes.FALSE);
                return;
            } else {
                var cursor = result.find({"user_id" : userId});
                var documentArray = cursor.toArray(function func(error, documents) {
                    if(error) {
                        logger.e(error);
                        callback(myResultCodes.FALSE);
                    } else {
                        var documentsCount = documents.length;
                        if(documentsCount > 0) {
                            callback(myResultCodes.TRUE);
                        } else {
                            callback(myResultCodes.FALSE);
                        }
                    }
                });
            }
        }
    );
}

function isUserPasswordCorrect(userId, password, callback) {
    if(! dbProviderInstance) {
        dbProviderInstance = new dbProvider.dbProvider(host, port, dbName);
    }
    dbProviderInstance.getCollection(
        "test_collection",
        function(error, result) {
            if(error) {
                logger.e(TAG, error);
                callback(myResultCodes.FALSE);
                return;
            } else {
                var cursor = result.find({"user_id" : userId, "user_password" : password});
                var documentArray = cursor.toArray(function func(error, documents) {
                    if(error) {
                        logger.e(error);
                        callback(myResultCodes.FALSE);
                    } else {
                        var documentsCount = documents.length;
                        if(documentsCount > 0) {
                            callback(myResultCodes.TRUE);
                        } else {
                            callback(myResultCodes.FALSE);
                        }
                    }
                });
            }
        }
    );
}

function selfTest() {
    isUserExisted(
        "ever",
        function(result) {
            logger.v(TAG, "User existed? " + result);
        }
    );

    isUserPasswordCorrect(
        "ever",
	"1234",
        function(result) {
            logger.v(TAG, "Password correct? " + result);
        }
    );
}

//selfTest();

exports.isUserExisted = isUserExisted;
exports.isUserPasswordCorrect = isUserPasswordCorrect;
