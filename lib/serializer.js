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
                that._processType(resource, function(err, result) {
                    payload.type = result;

                    callback(null);
                });
            },
            id: function(callback) {
                that._processId(resource, function(err, result) {
                    payload.id = result;

                    callback(null);
                });
            },
            attributes: function(callback) {
                if (!asRelationship) {
                    that._processAttributes(resource, function(err, result) {
                        payload.attributes = result;

                        callback(null);
                    });
                } else {
                    return callback(null);
                }
            },
            relationships: function(callback) {
                if (!asRelationship) {
                    that._processRelationships(resource, function(err, result) {
                        payload.relationships = result;

                        callback(null);
                    });
                } else {
                    return callback(null);
                }
            },
            links: function(callback) {
                if (!asRelationship) {
                    that._processLinks(resource, function(err, result) {
                        payload.links = result;

                        callback(null);
                    });
                } else {
                    return callback(null);
                }
            },
            meta: function(callback) {
                if (!asRelationship) {
                    that._processMeta(resource, function(err, result) {
                        payload.meta = result;

                        callback(null);
                    });
                } else {
                    return callback(null);
                }
            }
        }, function(err) {
            if (err) {
                return callback(err);
            }

            return callback(null, payload);
        });
    }

    _processType(resource, callback) {
        this.options.getType(resource, this.options, function(err, result) {
            if (err) {
                return callback(err);
            }

            return callback(null, result);
        });
    }

    _processId(resource, callback) {
        this.options.getId(resource, this.options, function(err, result) {
            if (err) {
                return callback(err);
            }

            return callback(null, result);
        });
    }

    _processAttributes(resource, callback) {
        if (_.isFunction(this.options.getAttributes)) {
            this.options.getAttributes(resource, this.options, function(err, result) {
                if (err) {
                    return callback(err);
                }

                return callback(null, result);
            });
        } else {
            return callback(null);
        }
    }

    _processRelationships(resource, callback) {
        if (_.isFunction(this.options.getRelationships)) {
            this.options.getRelationships(resource, this.options, function(err, result) {
                if (err) {
                    return callback(err);
                }

                var relationships = {};

                async.forEachOf(result, function(relationship, name, callback) {
                    relationship.toJSON(function(err, result) {
                        if (err) {
                            return callback(err);
                        }

                        relationships[name] = result;

                        return callback(null);
                    });
                }, function(err) {
                    if (err) {
                        return callback(err);
                    }

                    return callback(null, relationships);
                });
            });
        } else {
            return callback(null);
        }
    }

    _processLinks(resource, callback) {
        if (_.isFunction(this.options.getLinks)) {
            this.options.getLinks(resource, this.options, function(err, result) {
                if (err) {
                    return callback(err);
                }

                return callback(null, result);
            });
        } else {
            return callback(null);
        }
    }

    _processMeta(resource, callback) {
        if (_.isFunction(this.options.getMeta)) {
            this.options.getMeta(resource, this.options, function(err, result) {
                if (err) {
                    return callback(err);
                }

                return callback(null, result);
            });
        } else {
            return callback(null);
        }
    }
}

module.exports = Serializer;
