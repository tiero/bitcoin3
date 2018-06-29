const bitcoin = require("bitcoinjs-lib")

const PROVIDERS = {
  "blockcypher" : "https://api.blockcypher.com/v1/btc/"
}

const FEES_URI = "https://bitcoinfees.earn.com/api/v1/fees/recommended"

const NETWORKS = {
  "testnet" : {
    string:"test3",
    object: bitcoin.networks.testnet
  },
  "mainnet" : {
    string: "main",
    object: bitcoin.networks.bitcoin
  }
}

const ERROR_MESSAGE = {
  defaultAccount : "Must specify a default account to use eg. keypair",
  validAddress   : "The address provided is not a valid one",
  recipient      : "Must specify a recipient for the transaction",
  number         : "Must specify a proper number"
}

module.exports = {
  ERROR_MESSAGE,
  PROVIDERS, 
  NETWORKS,
  FEES_URI
}