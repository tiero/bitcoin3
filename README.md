# Bitcoin3

### Manage Bitcoin utxo  


# Install

`npm install bitcoin3`


# Getting started 

Create a `bitcoin3` instance 

```js
const Bitcoin3 = require("bitcoin3")
const btc3     = new Bitcoin3("testnet")

//OPTIONAL: default blockcypher API
btc3.setProvider("blockcypher")
```


Get the balance

```js
// Get balance of address
btc3.getBalance("2N8hwP1WmJrFF5QWABn38y63uYLhnJYJYTF").then(console.log)
```


Unlock the privatekey 
```js
//set the privatekey for signing
btc3.privateKeyToAccount("<privateKey>")

//Now the default account has been set
console.log(btc3.defaultAccount)
```


Send a transaction to a Bitcoin address
```js
//Send the actual transaction to an address with the amount of satoshi comprhensive of actual value + fee
btc3.sendTransaction(addressTo, 20000).then(console.log).catch(console.log)

```

# Bitcoin3 JavaScript API

All getters returns a **Promise**

## Index 

### Setters
* [setProvider()](#btc3setProvider)
* [setNetwork()](#btc3setNetwork)
* [privateKeyToAccount()](#btc3privateKeyToAccount)

### Getters
* [getBalance()](#btc3getBalance)
* [getUtxo()](#btc3getUtxo)
* [estimateFee()](#btc3estimateFee)

### Utils
* [isValidAddress()](#btc3isValidAddress)
* [sendTransaction()](#btc3sendTransaction)
* [createMultisig()](#btc3createMultisig)


## API

***

#### btc3.setProvider

##### Parameters

1. `String` - The blockexplorer API provider. Only **blockcypher** supported 

##### Returns

none

##### Example

```js
btc3.setProvider("blockcypher")
```

***


#### btc3.setNetwork

##### Parameters

1. `String` - The Bitcoin blockchain to work against. One of **testnet** and **mainnet** 

##### Returns

none

##### Example

```js
btc3.setNetwork("testnet")
```

***

#### btc3.privateKeyToAccount

##### Parameters

1. `String` - The WIF encoded private key. Mandatory for using `sendTransaction`

##### Returns

none

##### Example

```js
btc3.privateKeyToAccount("e331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109")
```

***
#### btc3.getBalance

##### Parameters

1. `String` - The base58 Bitcoin address to watch the balance for.

##### Returns

- `Promise:String|String` - Returns the balance in satoshis or catch the error

##### Example

```js
btc3.getBalance("2N8hwP1WmJrFF5QWABn38y63uYLhnJYJYTF")
  .then( satoshis => console.log('The balance is ' + satoshis))
  .catch( reason => console.log(reason))

//The balance is 1500000
```

***

#### btc3.getUtxo

##### Parameters

1. `String` - The base58 Bitcoin address to get the utxos of.

##### Returns

- `Promise:Array|String` - Returns the array of utxos per address in the standard format `{txid, vout, satoshis, confirmations}`

##### Example

```js
btc3.getUtxo("2N8hwP1WmJrFF5QWABn38y63uYLhnJYJYTF")
  .then( utxos => console.log(utxos))
  .catch( reason => console.log(reason))

//[...]
```

***


#### btc3.estimateFee

##### Parameters

none

##### Returns

- `Promise:String|String` - Returns the amount in satoshi for the fastest fee 

##### Example

```js
btc3.estimateFee()
  .then( fastestFee => console.log(fastestFee))
  .catch( reason => console.log(reason))

//20000
```

***

#### btc3.isValidAddress

##### Parameters

1. `String` - The Bitcoin address to validate

##### Returns

- `bool` - Returns true if it is a valid base58 address

##### Example

```js
const isValid = btc3.isValidAddress("000")
console.log(isValid)
//false
```

***

#### btc3.sendTransaction

##### Parameters

1. `String` - The Bitcoin address to sent sathosis
2. `Number` - The integer value of satoshis to be sent

##### Returns

- `Promise:Object|String` - Return the transaction object receipt 

##### Example

```js
const dest = "2N8hwP1WmJrFF5QWABn38y63uYLhnJYJYTF"
const amount = 15000000

btc3.sendTransaction(dest, amount)
.then(console.log)

// {...} 
```

***

#### btc3.createMultisig

##### Parameters

1. `Array` - Array of public keys in hex format
2. `m` - treshold needed for sign a valid transaction 

##### Returns

- `String` - Return a m-of-n P2SH Multisig Address 

##### Example

```js

const keys = [
      '032b4c06c06c3ec0b7fa29519dfa5aae193ee2cc35ca127f29f14ec605d62fb63d',
      '0216c92abe433106491bdeb4a261226f20f5a4ac86220cc6e37655aac6bf3c1f2a',
      '039e05da8b8ea4f9868ecebb25998c7701542986233f4401799551fbecf316b18f'
]
const m = 2

const address = btc3.createMultisig(keys, 2)
console.log(address)
// testnet: 2N2VHjejHUCbJSRnoVyoesXMDsaiUey5ptp
//mainnet 3Aw5fuoFrk5xEeAFprBnFaMxfEWJp6vqNX
```





