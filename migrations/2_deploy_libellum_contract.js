const LibellumTokenTimelock = artifacts.require('./contracts/LibellumTokenTimelock.sol');
const LibellumCoin = artifacts.require('./contracts/LibellumCoin.sol');

module.exports = function(deployer, network, accounts) {
    let _1_1_2019_time = 1546300800;
    let owner = accounts[0];
    let founder = accounts[1];

    return deployer
        .then(() => {
            return deployer.deploy(
                LibellumTokenTimelock,
                founder,
                _1_1_2019_time, 
                {from: owner});
        })
        .then((founderTokenTimelock) => {
            return deployer.deploy(
                LibellumCoin,
                founder,
                founderTokenTimelock.address,
                {from: owner});
        });
        
};