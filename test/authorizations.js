'use strict';

const should = require('should');
const uuid = require('node-uuid');

const config = require('../.config.js');

const Kash = require('../src/kash.js');
const kash = new Kash(config.serverKey, config.apiEndpoint);

const customerId = config.customerId;

describe('Kash', function() {

    describe('#authorizeAmount()', function() {

        context('with zero dollars', function() {
            it('should fail', function() {
                return kash.authorizeAmount(customerId, 0).should.be.rejected().then(err => {
                    should.exist(err.error);
                    should.exist(err.statusCode);
                    err.statusCode.should.not.eql(403);
                });
            });
        });

        context('with $20 dollars', function() {
            it('should succeed', function() {
                return kash.authorizeAmount(customerId, 2000).should.be.fulfilled().then(result => {
                    should.exist(result.authorization_id);
                    should.exist(result.valid_until);
                });
            });
        });
    });

    describe('#cancelAuthorization()', function() {
        let authorizationId;

        before(function() {
            return kash.authorizeAmount(customerId, 2000)
                .then(function(result) {
                    authorizationId = result.authorization_id;
                    should.exist(authorizationId);
                });
        });

        context('with valid authorization_id', function() {
            it('should cancel the authorization', function() {
                return kash.cancelAuthorization(authorizationId);
            });
        });

        context('with already canceled authorization_id', function() {
            it('should succeed', function() {
                return kash.cancelAuthorization(authorizationId);
            });
        });

        context('with invalid authorization_id', function() {
            it('should fail', function() {
                return kash.cancelAuthorization(uuid.v4()).should.be.rejected().then(err => {
                    should.exist(err.error);
                    should.exist(err.statusCode);
                });
            });
        });
    });
});
