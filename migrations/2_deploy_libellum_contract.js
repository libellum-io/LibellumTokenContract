const LibellumTokenTimelock = artifacts.require('./contracts/LibellumTokenTimelock.sol');
const LibellumCoin = artifacts.require('./contracts/LibellumCoin.sol');

module.exports = function(deployer, network, accounts) {
    let _1_1_2019_time = 1546300800;

    return deployer
        .then(() => {
            return deployer.deploy(LibellumCoin, {from: accounts[0]});
        })
        .then(() => {
            return deployer.deploy(LibellumTokenTimelock, accounts[1], _1_1_2019_time, {from: accounts[0]});
        });
};