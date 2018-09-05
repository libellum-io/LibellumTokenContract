const LibellumCrowdsale = artifacts.require('./contracts/LibellumCrowdsale.sol');

module.exports = function(deployer, network, accounts) {
    let goal = 200000000000000000000; // 200 ethers
    let _1_10_2018_time = 1538352000;
    let _15_10_2018_time = 1539561600;
    let _1_11_2018_time = 1541030400;
    let _1_12_2018_time = 1543622400;

    let owner = accounts[0];
    let fundsWallet = accounts[9];

    return deployer
        .then(() => {
            return deployer.deploy(
                LibellumCrowdsale,
                goal,
                _1_10_2018_time,
                _15_10_2018_time,
                _1_11_2018_time,
                _1_12_2018_time,
                fundsWallet,
                {from: owner});
        });
};