'use strict';

class Resource {
    constructor(data, serializer) {
        this.data = data;
        this.serializer = serializer;
    }

    toJSON(callback) {
        this.serializer.serialize(this.data, false, callback);
    }
}

module.exports = Resource;
