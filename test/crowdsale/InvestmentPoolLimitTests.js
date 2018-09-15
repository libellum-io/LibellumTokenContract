const { LibellumTestValuesFrom } = require("../TestFactory.js");
const { expectThrow } = require('../helpers/expectThrow.js');
const { ether } = require('../helpers/ether.js');
const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-bignumber')(BigNumber))
    .should();

contract('InvestmentPoolLimitTests', function (accounts) {
    let goal = ether(20);
    let defaultIndividualCap = ether(20000);

    // setting phase 2 custom rate so that maximal ETH amount for buying is 5000 ETH
    // 5000 ETH = 50 000 000 LIB / 10000;
    let phase2CustomRate = 10000;

    beforeEach(async function () {
        this.values = await LibellumTestValuesFrom(accounts, goal, defaultIndividualCap);
        await this.values.increaseTimeToPhase1();
        await this.values.libellumCrowdsale.updatePhase2Rate(phase2CustomRate);
        await this.values.increaseTimeToPhase2();
    });

    describe('when investment pool of 50 Mio LIBs is not filled', function () {
        it ('beneficiary is able to buy tokens', async function () {
            await this.values.libellumCrowdsale.buyTokens(this.values.whitelistedBeneficiary, {value: ether(10), from: this.values.whitelistedBeneficiary});
            (await this.values.libellumCrowdsale.balances.call(this.values.whitelistedBeneficiary)).should.be.bignumber.equal(ether(10) * phase2CustomRate);
        });
    });

    describe('when investment pool of 50 Mio LIBs is filled', function () {
        it ('beneficiary is not able to buy LIBs', async function () {
            await this.values.libellumCrowdsale.buyTokens(this.values.whitelistedBeneficiary, {value: ether(4900), from: this.values.whitelistedBeneficiary});
            await this.values.libellumCrowdsale.buyTokens(this.values.whitelistedBeneficiary, {value: ether(50), from: this.values.whitelistedBeneficiary});
            await this.values.libellumCrowdsale.buyTokens(this.values.whitelistedBeneficiary, {value: ether(40), from: this.values.whitelistedBeneficiary});
            await this.values.libellumCrowdsale.buyTokens(this.values.whitelistedBeneficiary, {value: ether(10), from: this.values.whitelistedBeneficiary});
            await expectThrow(this.values.libellumCrowdsale.buyTokens(this.values.whitelistedBeneficiary, {value: ether(0.1), from: this.values.whitelistedBeneficiary}));
        });
    });
});