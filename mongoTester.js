var logger = require("./logger");
var mongodb = require("mongodb");
var mongodbClient = mongodb.MongoClient;

mongodbClient.connect(
    "mongodb://127.0.0.1:27017/chatdb",
    function(err, db) {
        if(err) {
            logger.e("Failed to connect db! " + err);
        }

        db.dropDatabase(function(err, done) {
            var collection = db.collection("user_pool");
            collection.insert(
                {"user_id" : "ever", "pwd" : "xxxx"},
                function(err, docs) {
                }
            );
            
            collection.find().toArray(
                function(err, results) {
                    console.dir(results);
                    db.close();
                }
            );
        });
    }
);
