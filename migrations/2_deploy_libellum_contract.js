const LibellumCrowdsale = artifacts.require('./contracts/crowdsale/LibellumCrowdsale.sol');
const LibellumTokenDistribution = artifacts.require('./contracts/distribution/LibellumTokenDistribution.sol');

module.exports = function(deployer, network, accounts) {
    let goal = 200000000000000000000; // 200 ether
    let defaultIndividualCap = 1000000000000000000000; // 1000 ether
    let openingTime = 1538870400; // 7-Oct-18
    let phase1ToPhase2Time = 1539561600; // 15-Oct-18
    let phase2ToPhase3Time = 1541030400; // 1-Nov-18
    let closingTime = 1543622400; // 1-Dec-18

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
                openingTime,
                phase1ToPhase2Time,
                phase2ToPhase3Time,
                closingTime,
                fundsWallet,
                distributionAddresses,
                {from: owner});
        });
};