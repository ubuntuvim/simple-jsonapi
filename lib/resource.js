'use strict';

var _ = require('lodash');

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
