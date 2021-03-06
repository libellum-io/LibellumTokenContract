const LibellumCrowdsale = artifacts.require('./contracts/crowdsale/LibellumCrowdsale.sol');
const LibellumTokenDistribution = artifacts.require('./contracts/distribution/LibellumTokenDistribution.sol');

module.exports = function(deployer, network, accounts) {
    let goal = 1000000000000000000; // 1 ether
    let defaultIndividualCap = 1000000000000000000000; // 1000 ether
    let openingTime = 1542366000; // 16-Nov-18, 11:00 AM GMT
    let phase1ToPhase2Time = 1543017600; // 24-Nov-18, 0:00 AM GMT
    let phase2ToPhase3Time = 1544054400; // 6-Dec-18, 0:00 AM GMT
    let closingTime = 1544871600; // 15-Dec-18, 11:00 AM GMT

    let owner = accounts[0];
    let founders = ['0xc8907621675711ed05b56d5f1ca98199d5EF13ba', '0xfE8Ff8d8d9F7d4357aD310f713A3CC770f16A079']
    let advisors = ['0x4c6Bc852930B46b5A8b4dF230cA7f37b84b1b0a9', '0x310dB8285Cb7eA7262EEbEb415694B54CC9Be101'];
    let bountyPool = '0x3471A914dD139B2358e56467d961f7Df2E6e5290';
    let rAndDPoolAddress = '0x3471A914dD139B2358e56467d961f7Df2E6e5290';
    let teamReserveFundAddress = '0x3471A914dD139B2358e56467d961f7Df2E6e5290';
    let fundsWallet = '0xc8907621675711ed05b56d5f1ca98199d5EF13ba';

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