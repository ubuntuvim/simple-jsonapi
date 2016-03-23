'use strict';

var _ = require('lodash'),
    async = require('async'),
    Joi = require('joi'),
    defaultOptions = require('./options/document'),
    documentSchema = require('./validators/document');

class Document {
    constructor(element, options) {
        this.version = '1.0';
        this.element = element || {};
        this.options = _.defaults({}, options, defaultOptions);
        this.meta = {};
        this.jsonapi = {
            version: '1.0'
        }
        this.errors = [];
        this.links = {};
        this.included = [];
    }

    addToMeta(meta, callback) {
        meta = (_.isArray(meta)) ? meta : [meta];

        for (var val of meta) {
            _.merge(this.meta, val);
        }

        return callback(null);
    }

    addToErrors(error, callback) {
        error = (_.isArray(error)) ? error : [error];

        for (var val of error) {
            this.errors.push(val);
        }

        return callback(null);
    }

    addToLinks(link, callback) {
        link = (_.isArray(link)) ? link : [link];

        for (var val of link) {
            _.merge(this.links, val);
        }

        return callback(null);
    }

    addToIncluded(element, callback) {
        this.included = _.concat(this.included, element);

        return callback(null);
    }

    toJSON(callback) {
        var that = this;
        var payload = {};

        if (!_.isEmpty(this.errors)) {
            payload.errors = this.errors;
        }

        if (!_.isEmpty(this.meta)) {
            payload.meta = this.meta;
        }

        if (this.options.showImplementation) {
            payload.jsonapi = this.jsonapi;
        }

        if (!_.isEmpty(this.links)) {
            payload.links = this.links;
        }

        async.auto({
            data: function(callback) {
                that._processData(function (err, result) {
                    if (err) {
                        return callback(err);
                    }

                    if (result) {
                        payload.data = result;
                    }

                    return callback(null);
                });
            },
            included: function(callback) {
                that._processIncluded(function (err, result) {
                    if (err) {
                        return callback(err);
                    }

                    if (result) {
                        payload.included = result;
                    }

                    return callback(null);
                });
            },
            validate: ['data', 'included', function(callback) {
                if (that.options.validate) {
                    Joi.validate(payload, documentSchema, function(err, validated) {
                        if (err) {
                            return callback(err);
                        }

                        return callback(null);
                    });
                } else {
                    return callback(null);
                }
            }]
        }, function(err) {
            if (err) {
                return callback(err);
            }

            return callback(null, payload);
        });
    }

    _processData(callback) {
        if (!_.isEmpty(this.element)) {
            this.element.toJSON(function(err, result) {
                if (err) {
                    return callback(err);
                }

                return callback(null, result);
            });
        } else {
            return callback(null, null);
        }
    }

    _processIncluded(callback) {
        if (!_.isEmpty(this.included)) {
            var included = [];

            async.each(this.included, function(resource, callback) {
                resource.toJSON(function(err, result) {
                    if (err) {
                        return callback(err);
                    }

                    included.push(result);

                    return callback(null);
                });
            }, function(err) {
                return callback(err, included);
            });
        } else {
            return callback(null);
        }
    }
}

module.exports = Document;
