'use strict';

var _ = require('lodash'),
    async = require('async'),
    Resource = require('./resource');

class Collection {
    constructor(data, serializer) {
        this.resources = [];
        data = (_.isArray(data)) ? data : [data];

        for (var val of data) {
            this.resources.push(new Resource(val, serializer));
        }
    }

    toJSON(callback) {
        var that = this;
        var payload = [];

        async.each(this.resources, function(resource, callback) {
            that._processResource(resource, function(err, result) {
                if (err) {
                    return callback(err);
                }

                payload.push(result);

                return callback(null);
            });
        }, function(err) {
            if (err) {
                return callback(err)
            }

            return callback(null, payload);
        });
    }

    _processResource(resource, callback) {
        resource.toJSON(function(err, result) {
            if (err) {
                return callback(err);
            }

            return callback(null, result);
        });
    }
}

module.exports = Collection;
