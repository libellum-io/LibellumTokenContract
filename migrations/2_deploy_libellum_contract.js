const LibellumCrowdsale = artifacts.require('./contracts/crowdsale/LibellumCrowdsale.sol');
const LibellumTokenDistribution = artifacts.require('./contracts/distribution/LibellumTokenDistribution.sol');

module.exports = function(deployer, network, accounts) {
    let goal = 200000000000000000000; // 200 ether
    let defaultIndividualCap = 10000000000000000000; // 10 ether
    let _1_10_2018_time = 1538352000;
    let _15_10_2018_time = 1539561600;
    let _1_11_2018_time = 1541030400;
    let _1_12_2018_time = 1543622400;

    let owner = accounts[0];
    let founders = [accounts[1], accounts[2]]
    let advisors = [accounts[3], accounts[4]];
    let bountyPool = accounts[5];
    let rAndDPoolAddress = accounts[6];
    let teamReserveFundAddress = accounts[7];
    let fundsWallet = accounts[9];

    let distributionAddresses = [founders[0], founders[1], advisors[0], advisors[1], bountyPool, rAndDPoolAddress, teamReserveFundAddress];

    return deployer
        .then(() => {
            return deployer.deploy(
                LibellumCrowdsale,
                goal,
                defaultIndividualCap,
                _1_10_2018_time,
                _15_10_2018_time,
                _1_11_2018_time,
                _1_12_2018_time,
                fundsWallet,
                distributionAddresses,
                {from: owner});
        });
};