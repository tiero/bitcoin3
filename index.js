const { PROVIDERS, NETWORKS } = require("./utils");

const axios = require("axios")

class Bitcoin3 {

  constructor(network, provider) {

    this.provider = provider || "blockcypher"
    this.network = network || "testnet"
  }

  setProvider(provider) {
    this.provider = provider
  }

  setNetwork(network) {
    this.network = network
  }

  getBalance(address) {
    const uri = `${PROVIDERS[this.provider]}${NETWORKS[this.network]}/addrs/${address}/balance`
    return axios.get(uri).then(r => r.data.final_balance)
  }

} 

