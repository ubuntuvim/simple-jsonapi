'use strict';

var chai = require('chai'),
    expect = chai.expect,
    sinon = require('sinon'),
    Resource = require('../lib/resource'),
    Serializer = require('../lib/serializer');

describe('Resource', function() {
    describe('toJSON', function() {
        it('should build a JSONAPI resource object', function(done) {
            var data = {
                id: 1,
                firstName: 'John',
                lastName: 'Doe'
            };
            var expected = {
                type: 'person',
                id: 1,
                attributes: {
                    firstName: 'John',
                    lastName: 'Doe'
                }
            };

            var serializer = new Serializer();
            var resource = new Resource(data, serializer);

            sinon.stub(serializer, 'serialize', function(rawData, asRelationship, callback) {
                callback(null, data);
            });

            resource.toJSON(function(err, result) {
                expect(err).to.equal(null);
                expect(result).to.deep.equal(data);

                serializer.serialize.restore();

                return done();
            });
        });
    });
});
