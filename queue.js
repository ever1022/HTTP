/*
 * queue model
 */

var logger = require("./logger");
function queue() {
   this.items = [];
   this.size = 0;
   this.headIndex = 0;
}
 
queue.prototype = {
    getSize: function () {
        return this.size;
    },
 
    isEmpty: function() {
        return this.size === 0;
    },

    push: function(object) {
        this.items.push(object);
        this.size++;
    },

    pop: function() {
        if (this.isEmpty()) {
        } else {
            var popedObject = this.items[this.headIndex];
            this.size--;
            this.headIndex = this.headIndex + 1;
            return popedObject;
        }
    },

    clear: function() {
        this.items = [];
        this.size = 0;
        this.headIndex = 0;
    }
}

function selfTest() {
    var objectQueue = new queue();
    objectQueue.push(function() {logger.v("Function A");});
    objectQueue.clear();
    objectQueue.push(function() {logger.v("Function B");});
    objectQueue.push(function() {logger.v("Function C");});
    objectQueue.push("D");
    objectQueue.push("E");

    while(! objectQueue.isEmpty()) {
        logger.v("Current size: " + objectQueue.getSize());
        var object = objectQueue.pop();
        if(typeof object === "function") {
            object();
        } else {
            logger.v("Object:" + object);
        }
    }
}
