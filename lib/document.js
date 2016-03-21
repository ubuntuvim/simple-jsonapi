'use strict';

var _ = require('lodash'),
    async = require('async'),
    Joi = require('joi'),
    defaultOptions = require('./options/document'),
    documentSchema = require('./validators/document');

class Document {
    constructor(options, element) {
        this.version = '1.0';
        this.options = _.defaults({}, options, defaultOptions);
        this.element = element || {};
        this.meta = {};
        this.errors = [];
        this.links = {};
        this.included = [];
    }

    addToMeta(meta, callback) {
        meta = (_.isArray(meta)) ? meta : [meta];

        for (var val of meta) {
            _.merge(this.meta, val);
        }

        return callback();
    }

    addToErrors(error, callback) {
        error = (_.isArray(error)) ? error : [error];

        for (var val of error) {
            this.errors.push(val);
        }

        return callback();
    }

    addToLinks(link, callback) {
        _.merge(this.links, link);

        return callback();
    }

    addToIncluded(element, callback) {
        this.included = _.concat(this.included, element);

        return callback();
    }

    toJSON(callback) {
        var that = this;
        var payload = {};

        async.auto({
            data: function(callback) {
                that._processData(payload, callback);
            },
            errors: function(callback) {
                that._processErrors(payload, callback);
            },
            meta: function(callback) {
                that._processMeta(payload, callback);
            },
            jsonapi: function(callback) {
                that._processJsonApi(payload, callback);
            },
            links: function(callback) {
                that._processLinks(payload, callback);
            },
            included: function(callback) {
                that._processIncluded(payload, callback);
            },
            validate: ['data', 'errors', 'meta', 'jsonapi', 'links', 'included', function(callback) {
                if (that.options.validate) {
                    Joi.validate(payload, documentSchema, function(err, validated) {
                        if (err) {
                            return callback(err);
                        }

                        return callback();
                    });
                } else {
                    return callback();
                }
            }]
        }, function(err) {
            if (err) {
                return callback(err);
            }

            return callback(null, payload);
        });
    }

    _processData(payload, callback) {
        if (!_.isEmpty(this.element)) {
            this.element.toJSON(function(err, result) {
                if (err) {
                    return callback(err);
                }

                payload.data = result;

                return callback();
            });
        } else {
            return callback();
        }
    }

    _processErrors(payload, callback) {
        if (!_.isEmpty(this.errors)) {
            payload.errors = this.errors;
        }

        return callback();
    }

    _processMeta(payload, callback) {
        if (!_.isEmpty(this.meta)) {
            payload.meta = this.meta;
        }

        return callback();
    }

    _processJsonApi(payload, callback) {
        if (this.options.showImplementation) {
            payload.jsonapi = {
                'version': this.version
            };
        }

        return callback();
    }

    _processLinks(payload, callback) {
        if (!_.isEmpty(this.links)) {
            payload.links = this.links;
        }

        return callback();
    }

    _processIncluded(payload, callback) {
        if (!_.isEmpty(this.included)) {
            payload.included = [];

            async.each(this.included, function(resource, callback) {
                resource.toJSON(function(err, result) {
                    if (err) {
                        return callback(err);
                    }

                    payload.included.push(result);

                    return callback();
                });
            }, function(err) {
                return callback(err);
            });
        } else {
            return callback();
        }
    }
}

module.exports = Document;
