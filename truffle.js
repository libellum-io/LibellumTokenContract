module.exports = {
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  },
  networks: {
      development: {
          host: "localhost",
          port: 8545,
          network_id: "*", // Match any network id
      },
      rinkeby: {
        host: "localhost",
        port: 8545,
        from: "0x0784b65432c5A5a75474BBdceeA2eDde45a19eE3",
        network_id: 4,
        gasPrice: 20000000000,
        gas: 7000000 // Gas limit used for deploys
      },
      live: {
        host: "localhost",
        port: 8545,
        from: "0x0784b65432c5A5a75474BBdceeA2eDde45a19eE3",
        network_id: 1,
        gasPrice: 20000000000, // 20 gwei
        gas: 7000000 // Gas limit used for deploys
      }
  }
};