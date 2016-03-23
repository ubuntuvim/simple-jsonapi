'use strict';

var chai = require('chai'),
    expect = chai.expect,
    sinon = require('sinon'),
    Joi = require('joi'),
    Document = require('../lib/document'),
    Resource = require('../lib/resource'),
    Serializer = require('../lib/serializer');

describe('Document', function() {
    describe('constructor', function() {
        it('should initialize default config variables', function() {
            var document = new Document();

            expect(document.options).to.have.property('showImplementation');
            expect(document.options).to.have.property('validate');
            expect(document.options.showImplementation).to.equal(true);
            expect(document.options.validate).to.equal(true);
        });

        it('should override config variables', function() {
            var document = new Document(null, {
                showImplementation: false,
                validate: false
            });

            expect(document.options).to.have.property('showImplementation');
            expect(document.options).to.have.property('validate');
            expect(document.options.showImplementation).to.equal(false);
            expect(document.options.validate).to.equal(false);
        });
    });

    describe('addToMeta', function() {
        it('should add meta objects to the document', function(done) {
            var document = new Document();
            var meta = {
                foo: 'bar'
            };

            document.addToMeta(meta, function(err) {
                expect(err).to.equal(null);
                expect(document).to.have.property('meta');
                expect(document.meta).to.deep.equal(meta);

                return done();
            });
        });
    });

    describe('addToErrors', function() {
        it('should add error objects to the document', function(done) {
            var document = new Document();
            var error = {
                title: 'Test error'
            };

            document.addToErrors(error, function(err) {
                expect(err).to.equal(null);
                expect(document).to.have.property('errors').with.length(1);
                expect(document.errors[0]).to.deep.equal(error);

                return done();
            });
        });
    });

    describe('addToLinks', function() {
        it('should add link objects to the document', function(done) {
            var document = new Document();
            var links = {
                self: 'http://api.example.com'
            };

            document.addToLinks(links, function(err) {
                expect(err).to.equal(null);
                expect(document).to.have.property('links');
                expect(document.links).to.deep.equal(links);

                return done();
            });
        });
    });

    describe('addToIncluded', function() {
        it('should add included objects to the document', function(done) {
            var document = new Document();
            var include = new Resource();

            document.addToIncluded(include, function(err) {
                expect(err).to.equal(null);
                expect(document).to.have.property('included').with.length(1);
                expect(document.included).to.deep.equal([include]);

                return done();
            });
        });
    });

    describe('toJSON', function() {
        it('should build a JSONAPI document', function(done) {
            var data = {
                type: 'person',
                id: 1,
                attributes: {
                    firstName: 'John',
                    lastName: 'Smith'
                }
            };
            var meta = {
                foo: 'bar'
            };
            var jsonapi = {
                version: '1.0'
            };
            var links = {
                self: 'http://api.example.com/users/1'
            };
            var expected = {
                data: data,
                meta: meta,
                jsonapi: jsonapi,
                links: links
            };

            var document = new Document();
            document.meta = meta;
            document.jsonapi = jsonapi;
            document.links = links;

            sinon.stub(document, '_processData', function(callback) {
                callback(null, data);
            });

            sinon.stub(document, '_processIncluded', function(callback) {
                callback(null, null);
            });

            sinon.stub(Joi, 'validate', function(payload, schema, callback) {
                callback(null, expected);
            });

            document.toJSON(function(err, result) {
                expect(err).to.equal(null);
                expect(result).to.deep.equal(expected);

                document._processData.restore();
                document._processIncluded.restore();
                Joi.validate.restore();

                return done();
            });
        });
    });

    describe('_processData', function() {
        it('should build a JSONAPI data element', function(done) {
            var data = {
                type: 'person',
                id: 1,
                attributes: {
                    firstName: 'John',
                    lastName: 'Smith'
                }
            };
            var resource = new Resource();
            var document = new Document(resource);

            sinon.stub(resource, 'toJSON', function(callback) {
                callback(null, data);
            });

            document._processData(function(err, result) {
                expect(err).to.equal(null);
                expect(result).to.deep.equal(data);

                resource.toJSON.restore();

                return done();
            });
        });
    });

    describe('_processIncluded', function() {
        it('should build a JSONAPI included element', function(done) {
            var included = {
                type: 'address',
                id: 1,
                attributes: {
                    line: '123 Testing Way',
                    town: 'Test Town'
                }
            };
            var resource = new Resource();
            var document = new Document();

            document.included = [
                resource
            ];

            sinon.stub(resource, 'toJSON', function(callback) {
                callback(null, included);
            });

            document._processIncluded(function(err, result) {
                expect(err).to.equal(null);
                expect(result).to.deep.equal([included]);

                resource.toJSON.restore();

                return done();
            });
        });
    });
});
