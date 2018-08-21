const fs = require("fs")
const Bitcoin3 = require('../index')
const b3 = new Bitcoin3("testnet")
const bitcoin = require("bitcoinjs-lib")
const assert = require("assert")
const { NETWORKS } = require("../constants")


function generateRandomKeysAndCreateMultisigAddress() {
  const keys = [
    bitcoin.ECPair.makeRandom({ network: NETWORKS[b3.network].object }),
    bitcoin.ECPair.makeRandom({ network: NETWORKS[b3.network].object }),
    bitcoin.ECPair.makeRandom({ network: NETWORKS[b3.network].object }),
    bitcoin.ECPair.makeRandom({ network: NETWORKS[b3.network].object })
  ].map((key) => {
    const { publicKey, privateKey } = key
    return { publicKey, privateKey }
  })

  const multisig = b3.createMultisig(keys.map(key => key.publicKey))
  assert(multisig, "error in generateRandomKeysAndCreateMultisigAddress")
}

//fs.writeFileSync('keys.json', JSON.stringify(keys)) 

/* ================== */

//console.log(JSON.parse(fs.readFileSync('keys.json')))
//b3.privateKeyToAccount('cRgnQe9MUu1JznntrLaoQpB476M8PURvXVQB5R2eqms5tXnzNsrr')
//console.log(b3.defaultAccount)

function testCreateMultisig() {
  const keys = JSON.parse(fs.readFileSync('test/keys.json'))
  const multisig = b3.createMultisig(keys.map(key => key.publicKey))

    assert.strictEqual(multisig, "2Mw2rd1UdyQN3ab3gStbXaLz6AYD1TzTQdd", "error in testCreateMultisig")

}

function runTests(array) {
  let errors = [], success = 0
  while (array.length){ 
    const result = array.shift().call()
    
    if (result !== undefined) {
      errors.push(result)
    } else {
      success++
    }
  }
  console.log("Success: " + success)
  console.log("Errors: " + errors.length)
}

//Run
runTests([
  () => generateRandomKeysAndCreateMultisigAddress(),
  () => testCreateMultisig()
])

