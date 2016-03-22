'use strict';

var chai = require('chai'),
    expect = chai.expect,
    sinon = require('sinon'),
    Serializer = require('../lib/serializer'),
    Resource = require('../lib/resource'),
    Relationship = require('../lib/relationship');

describe('Serializer', function() {
    describe('constructor', function() {
        it('should initialize config variables', function() {
            var serializer = new Serializer({
                getType: function() {},
                getId: function() {}
            });

            expect(serializer.options).to.have.property('getType');
            expect(serializer.options).to.have.property('getId');
        });
    });

    describe('serialize', function() {
        it('should build a JSONAPI resource object from to given data', function(done) {
            var type = 'person';
            var id = 1;
            var attributes = {
                firstName: 'John',
                lastName: 'Smith'
            };
            var meta = {
                foo: 'bar'
            };
            var links = {
                self: 'http://api.example.com/users/1'
            };
            var relationship = {
                test: {
                    type: 'person',
                    id: 2,
                    attributes: {
                        firstName: 'Jane',
                        lastName: 'Doe'
                    }
                }
            };
            var expected = {
                type: type,
                id: id,
                meta: meta,
                links: links,
                attributes: attributes,
                relationships: relationship
            };
            var resource = new Resource();
            var serializer = new Serializer();

            sinon.stub(serializer, '_processType', function(resource, callback) {
                callback(null, type);
            });

            sinon.stub(serializer, '_processId', function(resource, callback) {
                callback(null, id);
            });

            sinon.stub(serializer, '_processAttributes', function(resource, callback) {
                callback(null, attributes);
            });

            sinon.stub(serializer, '_processRelationships', function(resource, callback) {
                callback(null, relationship);
            });

            sinon.stub(serializer, '_processLinks', function(resource, callback) {
                callback(null, links);
            });

            sinon.stub(serializer, '_processMeta', function(resource, callback) {
                callback(null, meta);
            });

            serializer.serialize(resource, false, function(err, result) {
                expect(err).to.equal(null);
                expect(result).to.deep.equal(expected);

                serializer._processType.restore();
                serializer._processId.restore();
                serializer._processAttributes.restore();
                serializer._processRelationships.restore();
                serializer._processLinks.restore();
                serializer._processMeta.restore();

                return done();
            });
        });
    });

    describe('_processType', function() {
        it('should extract the type from the serializer options', function(done) {
            var serializer = new Serializer({
                getType: function(resource, options, callback) {
                    return callback(null, 'person')
                }
            });
            var resource = new Resource({}, serializer);

            serializer._processType(resource, function(err, result) {
                expect(err).to.equal(null);
                expect(result).to.deep.equal('person');

                return done();
            });
        });
    });

    describe('_processId', function() {
        it('should extract the ID from a resource using the serializer options', function(done) {
            var id = 1;
            var serializer = new Serializer({
                getId: function(resource, options, callback) {
                    return callback(null, resource.data.id);
                }
            });
            var resource = new Resource({
                id: id
            }, serializer);

            serializer._processId(resource, function(err, result) {
                expect(err).to.equal(null);
                expect(result).to.deep.equal(id);

                return done();
            });
        });
    });

    describe('_processAttributes', function() {
        it('should extract the attributes from a resource using the serializer options', function(done) {
            var attributes = {
                firstName: 'John',
                lastName: 'Smith'
            };
            var serializer = new Serializer({
                getAttributes: function(resource, options, callback) {
                    return callback(null, {
                        firstName: resource.data.firstName,
                        lastName: resource.data.lastName
                    });
                }
            });
            var resource = new Resource({
                firstName: attributes.firstName,
                lastName: attributes.lastName
            }, serializer);

            serializer._processAttributes(resource, function(err, result) {
                expect(err).to.equal(null);
                expect(result).to.deep.equal(attributes);

                return done();
            });
        });
    });

    describe('_processRelationships', function() {
        it('should extract relationship objects from the resource using the serializer options', function(done) {
            var data = {
                type: 'address',
                id: 1,
                attributes: {
                    line: '123 Testing Way',
                    town: 'Test Town'
                }
            };
            var expected = {
                address: data
            };
            var relationship = new Relationship();
            var serializer = new Serializer({
                getRelationships: function(resource, options, callback) {
                    return callback(null, {
                        address: relationship
                    });
                }
            });
            var resource = new Resource({}, serializer);

            sinon.stub(relationship, 'toJSON', function(callback) {
                callback(null, data);
            });

            serializer._processRelationships(resource, function(err, result) {
                expect(err).to.equal(null);
                expect(result).to.deep.equal(expected);

                relationship.toJSON.restore();

                return done();
            });
        });
    });

    describe('_processLinks', function() {
        it('should extract links from the serializer options', function(done) {
            var links = {
                self: 'http://api.example.com'
            };
            var serializer = new Serializer({
                getLinks: function(resource, options, callback) {
                    return callback(null, links);
                }
            });
            var resource = new Resource({}, serializer);

            serializer._processLinks(resource, function(err, result) {
                expect(err).to.equal(null);
                expect(result).to.deep.equal(links);

                return done();
            });
        });
    });

    describe('_processMeta', function() {
        it('should extract meta from the serializer options', function(done) {
            var meta = {
                foo: 'bar'
            };
            var serializer = new Serializer({
                getMeta: function(resource, options, callback) {
                    return callback(null, meta);
                }
            });
            var resource = new Resource({}, serializer);

            serializer._processMeta(resource, function(err, result) {
                expect(err).to.equal(null);
                expect(result).to.deep.equal(meta);

                return done();
            });
        });
    });
});
