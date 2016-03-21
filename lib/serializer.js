'use strict';

var _ = require('lodash'),
    async = require('async');

class Serializer {
    constructor(options) {
        this.options = options || {};
    }

    serialize(resource, asRelationship, callback) {
        var that = this;
        var payload = {};

        async.parallel({
            type: function(callback) {
                that._processType(resource, payload, callback);
            },
            id: function(callback) {
                that._processId(resource, payload, callback);
            },
            attributes: function(callback) {
                if (!asRelationship) {
                    that._processAttributes(resource, payload, callback);
                } else {
                    return callback();
                }
            },
            relationships: function(callback) {
                if (!asRelationship) {
                    that._processRelationships(resource, payload, callback);
                } else {
                    return callback();
                }
            },
            links: function(callback) {
                if (!asRelationship) {
                    that._processLinks(resource, payload, callback);
                } else {
                    return callback();
                }
            },
            meta: function(callback) {
                if (!asRelationship) {
                    that._processMeta(resource, payload, callback);
                } else {
                    return callback();
                }
            }
        }, function(err) {
            if (err) {
                return callback(err);
            }

            return callback(null, payload);
        });
    }

    _processType(resource, payload, callback) {
        this.options.getType(resource, this.options, function(err, result) {
            if (err) {
                return callback(err);
            }

            payload.type = result;

            return callback();
        });
    }

    _processId(resource, payload, callback) {
        this.options.getId(resource, this.options, function(err, result) {
            if (err) {
                return callback(err);
            }

            payload.id = result;

            return callback();
        });
    }

    _processAttributes(resource, payload, callback) {
        if (_.isFunction(this.options.getAttributes)) {
            this.options.getAttributes(resource, this.options, function(err, result) {
                if (err) {
                    return callback(err);
                }

                payload.attributes = result;

                return callback();
            });
        } else {
            return callback();
        }
    }

    _processRelationships(resource, payload, callback) {
        if (_.isFunction(this.options.getRelationships)) {
            this.options.getRelationships(resource, this.options, function(err, result) {
                if (err) {
                    return callback(err);
                }

                payload.relationships = {};

                async.forEachOf(result, function(relationship, name, callback) {
                    relationship.toJSON(function(err, result) {
                        if (err) {
                            return callback(err);
                        }

                        payload.relationships[name] = result;

                        return callback();
                    });
                }, function(err) {
                    if (err) {
                        return callback(err);
                    }

                    return callback();
                });
            });
        } else {
            return callback();
        }
    }

    _processLinks(resource, payload, callback) {
        if (_.isFunction(this.options.getLinks)) {
            this.options.getLinks(resource, this.options, function(err, result) {
                if (err) {
                    return callback(err);
                }

                payload.links = result;

                return callback();
            });
        } else {
            return callback();
        }
    }

    _processMeta(resource, payload, callback) {
        if (_.isFunction(this.options.getMeta)) {
            this.options.getMeta(resource, this.options, function(err, result) {
                if (err) {
                    return callback(err);
                }

                payload.meta = result;

                return callback();
            });
        } else {
            return callback();
        }
    }
}

module.exports = Serializer;
