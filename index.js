const {
  FEES_URI,
  NETWORKS,
  PROVIDERS,
  ERROR_MESSAGE
} = require("./constants")

const axios = require("axios")
const bitcoin = require("bitcoinjs-lib")

class Bitcoin3 {

  constructor(network, provider) {

    this.bitcoin = bitcoin


    this.provider = provider || "blockcypher"
    this.network = network || "testnet"
    this.defaultAccount = undefined
  }

  setProvider(provider) {
    this.provider = provider
  }

  setNetwork(network) {
    this.network = network
  }

  privateKeyToAccount(privateKey) {
    let keyPair
    try {
      keyPair = this.bitcoin.ECPair.fromWIF(privateKey, NETWORKS[this.network].object)
    } catch(e) {
      throw ERROR_MESSAGE.validAddress
    }
    const address = keyPair.getAddress()

    this.defaultAccount = Object.seal({
      address,
      privateKey,
      keyPair
    })
  }

  isValidAddress(address) {
    try {
      this.bitcoin.address.toOutputScript(address, NETWORKS[this.network].object)
      return true
    } catch (e) {
      return false
    } 
  }

  getTxSize(vin, vout) {
    return vin * 180 + vout * 34 + 10 + vin
  }

  getBalance(address) {
    if (!this.isValidAddress(address)) throw ERROR_MESSAGE.validAddress


    const uri = `${PROVIDERS[this.provider]}${NETWORKS[this.network].string}/addrs/${address}/balance`
    return axios.get(uri).then(r => r.data.final_balance)
  }

  estimateFee() {
    //Only mainnet, there are barely no fees on testnet
    return axios.get(FEES_URI).then(r => r.data.fastestFee)
  }

  getUtxo(address) {
    if (!this.isValidAddress(address)) throw ERROR_MESSAGE.validAddress

    const uri = `${PROVIDERS[this.provider]}${NETWORKS[this.network].string}/addrs/${address}?unspentOnly=true`

    return axios.get(uri).then(r => r.data.txrefs.map(tx => Object.seal({
      txid: tx.tx_hash,
      vout: tx.tx_output_n,
      satoshis: tx.value,
      confirmations: tx.confirmations
    })))
  }

  sendTransaction(to, value, dryRun) {
    dryRun = dryRun || false
    if (!this.defaultAccount) throw ERROR_MESSAGE.defaultAccount
    if (!to) throw ERROR_MESSAGE.recipient
    if (!this.isValidAddress(to)) throw ERROR_MESSAGE.validAddress
    if (!value || isNaN(value)) throw ERROR_MESSAGE.number

    return Promise.all([
      this.estimateFee(),
      this.getUtxo(this.defaultAccount.address)
    ]).then((res) => {
      const feePerByte = res[0]
      const utxos = res[1]

      //Setup inputs from utxos
      const tx = new this.bitcoin.TransactionBuilder(NETWORKS[this.network].object)
      let ninputs = 0
      let availableSat = 0

      for (let i = 0; i < utxos.length; i++) {
        const utxo = utxos[i]
        if (utxo.confirmations >= 3) {
          tx.addInput(utxo.txid, utxo.vout)
          availableSat += utxo.satoshis
          ninputs++

          if (availableSat >= value) break
        }
      }

      if (availableSat < value) throw "You do not have enough in your wallet"

      const change = availableSat - value
      const fee = this.getTxSize(ninputs, change > 0 ? 2 : 1) * feePerByte

      if (fee > value) throw "Satoshis amount must be larger than the fee"

      tx.addOutput(to, value - fee)

      if (change > 0) tx.addOutput(this.defaultAccount.address, change)

      for (let i = 0; i < ninputs; i++) {
        tx.sign(i, this.defaultAccount.keyPair)
      }
      const hexTx = tx.build().toHex()


      if (dryRun) {
        return Promise.resolve(hexTx)
      } else {
        const body = { tx: hexTx }
        const uri = `${PROVIDERS[this.provider]}${NETWORKS[this.network].string}/txs/push`
        return axios.post(uri, body).then(r => r.data.tx)
      }
    })
  }

}

module.exports = Bitcoin3