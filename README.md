## Installation

`npm install node-kash`

## Documentation

Documentation is available at [http://docs.withkash.com](http://docs.withkash.com).

## Tutorial

Note that each function call returns a promise. To charge a customer, remember
that you need to follow a 2-step process: First authorize the amount, then
create a transaction for the final amount you want to charge.

For authorizing an amount you want to charge:

```js
var kash = require('node-kash')('<Your Server Key>');
kash.authorizeAmount('<Customer ID>', amount)
    .then(function(result) {
        // Now use result.authorization_id with either cancelAuthorization() or
        // createTransaction()
        console.log(result.authorization_id);
    })
    .catch(function(err) {
        if (err.statusCode === 410) {
            // Customer needs to relink their bank account
            console.log(err.error);
        }
        else if (err.statusCode === 402) {
            // Customer has insufficient funds and Kash determines we won't be
            // able to retrieve the amount
            console.log(err.error);
        }
        else {
            // Any other error conditions
            console.log(err.error);
        }
    });
```

To cancel an authorized amount:

```js
var kash = require('node-kash')('<Your Server Key>');
// Using the authorizationId collected from authorizeAmount()
kash.cancelAuthorization(authorizationId)
    .then(function() {
        // Success!
    })
    .catch(function(err) {
        // Any other error conditions
        console.log(err.error);
    });
```

To actually charge the customer:

```js
var kash = require('node-kash')('<Your Server Key>');
// Using the authorizationId collected from authorizeAmount()
kash.createTransaction(authorizationId, amount)
    .then(function(result) {
        // Success!
        console.log(result.transaction_id);
    })
    .catch(function(err) {
        // Any other error conditions
        console.log(err.error);
    });
```

To do refunds:

```js
var kash = require('node-kash')('<Your Server Key>');
// Using the transactionId collected from createTransaction()
kash.refundTransaction(transactionId, amount)
    .then(function(result) {
        // Success!
    })
    .catch(function(err) {
        // Any other error conditions
        console.log(err.error);
    });
```
