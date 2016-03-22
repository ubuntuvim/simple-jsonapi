'use strict';

var chai = require('chai'),
    expect = chai.expect,
    sinon = require('sinon'),
    Relationship = require('../lib/relationship'),
    Serializer = require('../lib/serializer');

describe('Relationship', function() {
    describe('addToMeta', function() {
        it('should add meta objects to the relationship', function(done) {
            var relationship = new Relationship();
            var meta = {
                foo: 'bar'
            };

            relationship.addToMeta(meta, function(err) {
                expect(err).to.equal(null);
                expect(relationship).to.have.property('meta');
                expect(relationship.meta).to.deep.equal(meta);

                return done();
            });
        });
    });

    describe('addToLinks', function() {
        it('should add link objects to the relationship', function(done) {
            var relationship = new Relationship();
            var links = {
                self: 'http://api.example.com'
            };

            relationship.addToLinks(links, function(err) {
                expect(err).to.equal(null);
                expect(relationship).to.have.property('links');
                expect(relationship.links).to.deep.equal(links);

                return done();
            });
        });
    });

    describe('toJSON', function() {
        it('should build a JSONAPI relationship object', function(done) {
            var data = {
                type: 'person',
                id: 1
            };
            var meta = {
                foo: 'bar'
            };
            var links = {
                self: 'http://api.example.com/users/1'
            };
            var expected = {
                data: data,
                meta: meta,
                links: links
            };

            var serializer = new Serializer();
            var relationship = new Relationship(data, serializer);
            relationship.meta = meta;
            relationship.links = links;

            sinon.stub(serializer, 'serialize', function(rawData, asRelationship, callback) {
                callback(null, data);
            });

            relationship.toJSON(function(err, result) {
                expect(err).to.equal(null);
                expect(result).to.deep.equal(expected);

                serializer.serialize.restore();

                return done();
            });
        });
    });
});
