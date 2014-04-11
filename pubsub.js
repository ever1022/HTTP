/* pubsub (Publish/Subscribe) is a singleton model that provide a getInstance function
 * to retrieve the instance.
 */

var logger = require("./logger");
var pubsub = {
    subscribers: [],
    lastData: [],
    subscribe: function(topic, callback, receiveLastData) {
        logger.v("Add " + topic + " subscribers.");
        if(! this.subscribers[topic]) {
            this.subscribers[topic] = [];
        }
        this.subscribers[topic].push(callback);
        if(receiveLastData) {
            if(this.lastData[topic]) {
                callback(this.lastData[topic]);
            }
        }
    },
    unsubscribe: function(topic, callback) {
        if(! this.subscribers[topic]) {
            logger.v("No such topic: " + topic);
            return;
        }
        var index = this.subscribers[topic].indexOf(callback);
        if(~index) {
            this.subscribers[topic].splice(index, 1);
        }
    },
    publish: function(topic, data) {
        this.lastData[topic] = data;
        if(! this.subscribers[topic]) {
            logger.v("No subscriber exists for topic: " + topic);
            return;
        }
        for(var index = 0; index < this.subscribers[topic].length; index++) {
            this.subscribers[topic][index](data);
        }
    }
}

function getInstance() {
    return pubsub;
}

function selfTest() {
    var pubsubMain = getInstance();
    var callback1 = function(data) {
        logger.v("callback1: " + data);
    }
    var callback2 = function(data) {
        logger.v("callback2: " + data);
    }
    var callback3 = function(data) {
        logger.v("callback3: " + data);
    }
    pubsubMain.subscribe("topic1" , callback1);
    pubsubMain.subscribe("topic1" , callback2);
    pubsubMain.unsubscribe("topic1", callback1);
    pubsubMain.publish("topic1", "Data 1");
    pubsubMain.publish("topic2", "Data 2");
    pubsubMain.subscribe("topic1" , callback3, true);
}

exports.getInstance = getInstance;
