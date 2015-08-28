'use strict';

var should = require('should');

var config = require('../.config.js');

var Kash = require('../index.js');
var kash = new Kash(config.serverKey);

var customerId = config.customerId;

describe('transactions', function() {

    describe('charge customer', function() {
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

        describe('with zero dollars', function() {
            it('should fail', function(done) {
                kash.createTransaction(authorizationId, 0)
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
                kash.createTransaction(authorizationId, 2000)
                    .then(function(result) {
                        should.exist(result.transaction_id);
                        done();
                    })
                    .catch(done);
            });
        });
    });

    describe('refund customer', function() {
        var transactionId;

        before(function(done) {
            kash.authorizeAmount(customerId, 2000)
                .then(function(result) {
                    return kash.createTransaction(result.authorization_id, 2000);
                })
                .then(function(result) {
                    transactionId = result.transaction_id;
                    done();
                })
                .catch(done);
        });

        describe('for zero dollars', function() {
            it('should fail', function(done) {
                kash.refundTransaction(transactionId, 0)
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

        describe('for full amount', function() {
            it('should succeed', function(done) {
                kash.refundTransaction(transactionId, 2000)
                    .then(function(result) {
                        should.exist(result.transaction_id);
                        done();
                    })
                    .catch(done);
            });
        });
    });
});
