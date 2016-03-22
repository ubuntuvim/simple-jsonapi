'use strict';

var _ = require('lodash');

class Relationship {
    constructor(data, serializer) {
        this.data = data;
        this.serializer = serializer;
        this.meta = {};
        this.links = {};
    }

    addToMeta(meta, callback) {
        meta = (_.isArray(meta)) ? meta : [meta];

        for (var val of meta) {
            _.merge(this.meta, val);
        }

        return callback(null);
    }

    addToLinks(link, callback) {
        _.merge(this.links, link);

        return callback(null);
    }

    toJSON(callback) {
        var payload = {};

        if (!_.isEmpty(this.links)) {
            payload.links = this.links;
        }

        if (!_.isEmpty(this.meta)) {
            payload.meta = this.meta;
        }

        this.serializer.serialize(this.data, true, function(err, result) {
            if (err) {
                return callback(err);
            }

            payload.data = result;

            return callback(null, payload);
        });
    }
}

module.exports = Relationship;
