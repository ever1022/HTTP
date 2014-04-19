var logger = require("./logger");
var pubsub = require("./pubsub");
var mongodb = require("mongodb");
var myErrorCodes = require("./myErrorCodes");
var pubsubMain = pubsub.getInstance();

var TAG = "dbProvider";

function dbProvider(host, port, dbName) {
    this.databaseName = dbName;
    this.db = new mongodb.Db(dbName, new mongodb.Server(host, port), {"safe" : false});

    logger.v(TAG, "Connect database...");
    this.db.open(function(error) {
        if(error) {
            logger.e(TAG, "Cannot open db " + dbName + "!");
            pubsubMain.publish(dbName, myErrorCodes.ERROR); 
            return;
        }
        logger.v(TAG, "Done open database " + dbName + ".");
        pubsubMain.publish(dbName, myErrorCodes.NO_ERROR); 
    });
}

dbProvider.prototype = {
    getCollection: function(collectionName, callback) {
        logger.v(TAG, "Get collection...");
        var db = this.db;
        pubsubMain.subscribe(
            this.databaseName,
            function(data) {
                if(data === myErrorCodes.NO_ERROR) {
                    logger.v(TAG, "Database is ready.");
                    db.collection(
                        collectionName,
                        function(error, result) {
                            if(error) {
                                logger.e(TAG, error);
                                callback(error);
                            } else {
                                logger.v(TAG, "Get collection done.");
                                callback(null, result);
                            }
                        }
                    );
                } else {
                    logger.v(TAG, "Database occurrs error!");
                }
            },
            true
        );
    }
}

function verifyUser(jsonString, callback) {
    var user = JSON.parse(jsonString);
    logger.v(TAG, "User id: " + jsonString);
    dbp.getCollection(
        "user_pool",
        function(error, result) {
            logger.v(TAG, "db query callback " + result);
            if(error) {
                logger.v(TAG, "error...");
                callback("FAIL");
            } else {
                logger.v(TAG, "success...");
                var cursor = result.find({"user_id" : user.user_id}, {"pwd" : user.pwd});
                if(cursor.count() > 0) {
                    cursor.toArray(function(error, documents) {
                        logger.v(TAG, "toArray done...");
                        if(ducuments.length != 0) {
                            logger.i(TAG, "OK");
                            callback("OK");
                        } else {
                            logger.i(TAG, "FAIL");
                            callback("FAIL");
                        }
                    });
                } else {
                    logger.v(TAG, "done...");
                    callback("FAIL");
                }
            }
        }
    );
}

function selfTest() {
    var host = "127.0.0.1";
    var port = 27017;
    var dbName = "test";
    var dbProviderInstance = new dbProvider(host, port, dbName);
    dbProviderInstance.getCollection(
        "test_collection",
        function(error, result) {
            if(error) {
                logger.e(TAG, error);
            } else {
                var cursor = result.find();
                var documentArray = cursor.toArray(function callback(error, documents) {
                    var documentsCount = documents.length;
                    for(var index = 0; index < documentsCount; index++) {
                        logger.v(TAG, "" + JSON.stringify(documents[index]));
                    }
                });
            }
        }
    );
}
//selfTest();

exports.dbProvider = dbProvider;
