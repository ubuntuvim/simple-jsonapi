'use strict';

var _ = require('lodash'),
    async = require('async');

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

        return callback();
    }

    addToLinks(link, callback) {
        _.merge(this.links, link);

        return callback();
    }

    toJSON(callback) {
        var that = this;
        var payload = {};

        async.parallel({
            links: function(callback) {
                that._processLinks(payload, callback);
            },
            data: function(callback) {
                that.serializer.serialize(that.data, true, function(err, result) {
                    if (err) {
                        return callback(err);
                    }

                    payload.data = result;

                    return callback();
                });
            },
            meta: function(callback) {
                that._processMeta(payload, callback);
            },
        }, function(err) {
            if (err) {
                return callback(err);
            }

            return callback(null, payload);
        });
    }

    _processLinks(payload, callback) {
        if (!_.isEmpty(this.links)) {
            payload.links = this.links;
        }

        return callback();
    }

    _processMeta(payload, callback) {
        if (!_.isEmpty(this.meta)) {
            payload.meta = this.meta;
        }

        return callback();
    }
}

module.exports = Relationship;
