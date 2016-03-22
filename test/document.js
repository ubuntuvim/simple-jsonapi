'use strict';

var chai = require('chai'),
    expect = chai.expect,
    sinon = require('sinon'),
    Document = require('../lib/document'),
    Resource = require('../lib/resource');

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
            var document = new Document({
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
        it('', function() {

        });
    });

    describe('_processData', function() {
        it('', function() {

        });
    });

    describe('_processErrors', function() {
        it('', function() {

        });
    });

    describe('_processMeta', function() {
        it('', function() {

        });
    });

    describe('_processJsonApi', function() {
        it('', function() {

        });
    });

    describe('_processLinks', function() {
        it('', function() {

        });
    });

    describe('_processIncluded', function() {
        it('', function() {

        });
    });
});
