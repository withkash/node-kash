## Installation

`npm install node-kash`

## Documentation

Documentation is available at [https://docs.withkash.com](https://docs.withkash.com).

## Tutorial

Each function call returns a promise.

```js
var kash = require('node-kash')('<Your Server Key>');
kash.authorizeAmount(customerId, amount)
    .then(function(result) {
        console.log(result.authorization_id);
    });
```

