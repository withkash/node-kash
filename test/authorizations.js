'use strict';

var should = require('should');
var uuid = require('node-uuid');

var config = require('../.config.js');

var Kash = require('../index.js');
var kash = new Kash(config.serverKey);

var customerId = config.customerId;

describe('authorizations', function() {

    describe('authorize amount', function() {

        describe('with zero dollars', function() {
            it('should fail', function(done) {
                kash.authorizeAmount(customerId, 0)
                    .then(function() {
                        done('Should not succeed');
                    })
                    .catch(function(err) {
                        should.exist(err.error);
                        should.exist(err.statusCode);
                        done();
                    });
            });
        });

        describe('with $20 dollars', function() {
            it('should succeed', function(done) {
                kash.authorizeAmount(customerId, 2000)
                    .then(function(result) {
                        should.exist(result.authorization_id);
                        should.exist(result.valid_until);
                        done();
                    })
                    .catch(done);
            });
        });
    });

    describe('cancel authorization', function() {
        var authorizationId;

        before(function(done) {
            kash.authorizeAmount(customerId, 2000)
                .then(function(result) {
                    authorizationId = result.authorization_id;
                    should.exist(authorizationId);
                    done();
                })
                .catch(done);
        });

        describe('with valid authorization_id', function() {
            it('should cancel the authorization', function(done) {
                kash.cancelAuthorization(authorizationId)
                    .then(done)
                    .catch(done);
            });
        });

        describe('with already canceled authorization_id', function() {
            it('should succeed', function(done) {
                kash.cancelAuthorization(authorizationId)
                    .then(done)
                    .catch(done);
            });
        });

        describe('with invalid authorization_id', function() {
            it('should succeed', function(done) {
                kash.cancelAuthorization(uuid.v4())
                    .then(function() {
                        done('Should not succeed');
                    })
                    .catch(function(err) {
                        should.exist(err.error);
                        should.exist(err.statusCode);
                        done();
                    });
            });
        });
    });
});
