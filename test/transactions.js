'use strict';

const should = require('should');

const config = require('../.config.js');

const Kash = require('../src/kash.js');
const kash = new Kash(config.serverKey, config.apiEndpoint);

const customerId = config.customerId;

describe('transactions', function() {

    describe('charge customer', function() {
        let authorizationId;

        before(function() {
            return kash.authorizeAmount(customerId, 2000).should.be.fulfilled().then(result => {
                authorizationId = result.authorization_id;
                should.exist(authorizationId);
            });
        });

        describe('with zero dollars', function() {
            it('should fail', function() {
                return kash.createTransaction(authorizationId, 0).should.be.rejected().then(err => {
                    should.exist(err.error);
                    should.exist(err.statusCode);
                });
            });
        });

        describe('with $20 dollars', function() {
            it('should succeed', function() {
                return kash.createTransaction(authorizationId, 2000).should.be.fulfilled().then(result => {
                    should.exist(result.transaction_id);
                });
            });
        });
    });

    describe('refund customer', function() {
        let transactionId;

        before(function() {
            return kash.authorizeAmount(customerId, 2000)
                .then(function(result) {
                    return kash.createTransaction(result.authorization_id, 2000);
                })
                .then(function(result) {
                    transactionId = result.transaction_id;
                });
        });

        describe('for zero dollars', function() {
            it('should fail', function() {
                return kash.refundTransaction(transactionId, 0).should.be.rejected().then(err => {
                    should.exist(err.error);
                    should.exist(err.statusCode);
                });
            });
        });

        describe('for full amount', function() {
            it('should succeed', function() {
                return kash.refundTransaction(transactionId, 2000).should.be.fulfilled().then(result => {
                    should.exist(result.transaction_id);
                });
            });
        });
    });
});
