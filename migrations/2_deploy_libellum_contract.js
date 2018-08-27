const LibellumCoin = artifacts.require('./contracts/LibellumCoin.sol');

module.exports = function(deployer, network, accounts) {
    return deployer
        .then(() => {
            return deployer.deploy(LibellumCoin, {from: accounts[0]});
        });
};