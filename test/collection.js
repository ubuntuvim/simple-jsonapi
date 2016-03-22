'use strict';

var chai = require('chai'),
    expect = chai.expect,
    sinon = require('sinon'),
    Collection = require('../lib/collection'),
    Resource = require('../lib/resource'),
    Serializer = require('../lib/serializer');

describe('Collection', function() {
    describe('constructor', function() {
        it('should create a sub-resource for a single data object', function() {
            var serializer = new Serializer();
            var data = {
                id: 1,
                firstName: 'John',
                lastName: 'Smith'
            };

            var collection = new Collection(data, serializer);

            expect(collection).to.have.property('resources').with.length(1);
            expect(collection.resources[0]).to.have.property('data');
            expect(collection.resources[0]).to.have.property('serializer');
            expect(collection.resources[0].data).to.equal(data);
            expect(collection.resources[0].serializer).to.equal(serializer);
        });

        it('should create multiple sub-resources for a data array', function() {
            var serializer = new Serializer();
            var data = [
                {
                    id: 1,
                    firstName: 'John',
                    lastName: 'Smith'
                },
                {
                    id: 2,
                    firstName: 'Jane',
                    lastName: 'Doe'
                }
            ];

            var collection = new Collection(data, serializer);

            expect(collection).to.have.property('resources').with.length(2);

            for (var i in data) {
                expect(collection.resources[i]).to.have.property('data');
                expect(collection.resources[i]).to.have.property('serializer');
                expect(collection.resources[i].data).to.equal(data[i]);
                expect(collection.resources[i].serializer).to.equal(serializer);
            }
        });
    });

    describe('toJSON', function() {
        it('should build a JSON object from all sub-resources', function(done) {
            var data = [
                {
                    id: 1,
                    firstName: 'John',
                    lastName: 'Smith'
                },
                {
                    id: 2,
                    firstName: 'Jane',
                    lastName: 'Doe'
                }
            ];
            var output = [
                {
                    type: 'person',
                    id: 1,
                    attributes: {
                        firstName: 'John',
                        lastName: 'Smith'
                    }
                },
                {
                    type: 'person',
                    id: 2,
                    attributes: {
                        firstName: 'Jane',
                        lastName: 'Doe'
                    }
                }
            ];
            var serializer = new Serializer();
            var collection = new Collection(data, serializer);

            sinon.stub(collection, '_processResource', function(resource, callback) {
                callback(null, {
                    type: 'person',
                    id: resource.data.id,
                    attributes: {
                        firstName: resource.data.firstName,
                        lastName: resource.data.lastName
                    }
                });
            });

            collection.toJSON(function(err, payload) {
                expect(err).to.equal(null);
                expect(payload).to.deep.equal(output);

                collection._processResource.restore();
                return done();
            });
        });
    });

    describe('_processResource', function() {
        it('should build a JSON object from a single resource', function(done) {
            var data = [
                {
                    id: 1,
                    firstName: 'John',
                    lastName: 'Smith'
                }
            ];
            var output = {
                type: 'person',
                id: 1,
                attributes: {
                    firstName: 'John',
                    lastName: 'Smith'
                }
            };
            var serializer = new Serializer();
            var collection = new Collection(data, serializer);

            sinon.stub(collection.resources[0], 'toJSON', function(callback) {
                return callback(null, output);
            });

            collection._processResource(collection.resources[0], function(err, result) {
                expect(err).to.equal(null);
                expect(result).to.deep.equal(output);

                return done();
            });
        });
    });
});
