'use strict';

const restify = require('restify');
const urlparse = require('url').parse;

class Kash {
    constructor(serverKey, apiEndpoint) {
        this.serverKey = serverKey;

        if (!apiEndpoint) {
            if (serverKey && serverKey.startsWith('sk_test')) {
                apiEndpoint = 'https://api-test.withkash.com/v1';
            }
            else {
                apiEndpoint = 'https://api.withkash.com/v1';
            }
        }

        this.urlParts = urlparse(apiEndpoint);
    }

    authorizeAmount(customerId, amount) {
        const path = '/authorizations';
        const data = {
            customer_id: customerId, // eslint-disable-line camelcase
            amount: amount
        };
        return this._postPromise(path, data);
    }

    cancelAuthorization(authorizationId) {
        return this._deletePromise('/authorization/' + authorizationId);
    }

    createTransaction(authorizationId, amount) {
        const path = '/transactions';
        const data = {
            authorization_id: authorizationId, // eslint-disable-line camelcase
            amount: amount
        };
        return this._postPromise(path, data);
    }

    refundTransaction(transactionId, amount) {
        const path = '/refunds';
        const data = {
            transaction_id: transactionId, // eslint-disable-line camelcase
            amount: amount
        };
        return this._postPromise(path, data);
    }

    get apiUrl() {
        let url = this.urlParts.protocol;
        if (this.urlParts.slashes) {
            url += '//';
        }
        url += this.serverKey + ':@' + this.urlParts.host + ':' + this.urlParts.port;
        return url;
    }

    _postPromise(path, data) {
        const client = restify.createJsonClient({
            url: this.apiUrl
        });

        return new Promise((resolve, reject) => {
            client.post(this.urlParts.path + path, data, (err, req, res, obj) => {
                client.close();

                if (err) {
                    if (err.body) {
                        err.body.statusCode = res.statusCode;
                        reject(err.body);
                    }
                    else {
                        reject(err);
                    }
                }
                else {
                    resolve(obj);
                }
            });
        });
    }

    _deletePromise(path) {
        const client = restify.createJsonClient({
            url: this.apiUrl
        });

        return new Promise((resolve, reject) => {
            client.del(this.urlParts.path + path, (err, req, res) => {
                client.close();

                if (err) {
                    if (err.body) {
                        err.body.statusCode = res.statusCode;
                        reject(err.body);
                    }
                    else {
                        reject(err);
                    }
                }
                else {
                    resolve();
                }
            });
        });
    }
}
module.exports = Kash;
