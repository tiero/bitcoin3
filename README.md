# Bitcoin3
## Manage Bitcoin utxo  


# Install

`npm install bitcoin3`


# Usage 

```
const Bitcoin3 = require("bitcoin3")
const btc3     = new Bitcoin3("testnet")

//default blockcypher API, not need to setup
btc3.setProvider("blockcypher")

// Get balance of address
btc3.getBalance("2N8hwP1WmJrFF5QWABn38y63uYLhnJYJYTF").then(console.log)

//set the privatekey for signing
btc3.privateKeyToAccount("privateKey")

//Now the default account has been set
console.log(btc3.defaultAccount.address, btc3.defaultAccount.privateKey)

//Send the actual transaction to an address with the amount of satoshi comprhensive of actual value + fee
btc3.sendTransaction(addressTo, 20000).then(console.log).catch(console.log)

```

