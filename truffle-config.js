const path = require("path");
var HDWalletProvider = require("truffle-hdwallet-provider");

var mnemonic = "sad puzzle swarm upset wrong crunch region prosper vacant polar nice ask";

module.exports = {
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: 5777
    },
    // "kovan": {
    //   provider: () => new HDWalletProvider(mnemonic, "https://kovan.infura.io/v3/97efc724e0d44243947abcc78db59c5a"),
    //   network_id: 42,
    //   gas: 4700000
    // }
  }
};
