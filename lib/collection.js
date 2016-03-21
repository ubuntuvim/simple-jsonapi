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
        var payload = [];

        async.each(this.resources, function(resource, callback) {
            resource.toJSON(function(err, result) {
                if (err) {
                    return callback(err);
                }

                payload.push(result);

                return callback();
            });
        }, function(err) {
            if (err) {
                return callback(err)
            }

            return callback(null, payload);
        })
    }
}

module.exports = Collection;
