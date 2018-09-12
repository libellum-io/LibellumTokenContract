const LibellumCrowdsale = artifacts.require('./contracts/crowdsale/LibellumCrowdsale.sol');
const LibellumTokenDistribution = artifacts.require('./contracts/distribution/LibellumTokenDistribution.sol');

module.exports = function(deployer, network, accounts) {
    let goal = 200000000000000000000; // 200 ether
    let individualCap = 10000000000000000000; // 10 ether
    let _1_10_2018_time = 1538352000;
    let _15_10_2018_time = 1539561600;
    let _1_11_2018_time = 1541030400;
    let _1_12_2018_time = 1543622400;

    let owner = accounts[0];
    let founders = [accounts[1], accounts[2]]
    let advisors = [accounts[3], accounts[4]];
    let fundsWallet = accounts[9];

    return deployer
        .then(() => {
            return deployer.deploy(
                LibellumTokenDistribution,
                founders,
                advisors,
                {from: owner}
            );
        })
        .then((libellumTokenDistribution) => {
            return deployer.deploy(
                LibellumCrowdsale,
                goal,
                individualCap,
                _1_10_2018_time,
                _15_10_2018_time,
                _1_11_2018_time,
                _1_12_2018_time,
                fundsWallet,
                libellumTokenDistribution.address,
                {from: owner});
        });
};