# Bitcoin3
## Manage Bitcoin utxo  


# Install

`npm install bitcoin3`


# Usage 

```
const Bitcoin3 = require("bitcoin3")
const btc3     = new Bitcoin3("testnet")

btc3.setProvider("blockcypher")

btc3.getBalance("n2nkn4KFNtNbu6Q6GQPZwNZWDiiNsmm9d8").then(console.log)

```

