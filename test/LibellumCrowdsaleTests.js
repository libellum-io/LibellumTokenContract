const { LibellumTestValuesFrom, UtcDateFrom, LIB } = require("./TestFactory.js");
const { expectThrow } = require('./helpers/expectThrow.js');
const { ether } = require('./helpers/ether.js');
const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-bignumber')(BigNumber))
    .should();

contract('LibellumCrowdsale', function (accounts) {
    let goal = ether(20);
    let individualCap = ether(40);

    beforeEach(async function () {
        this.values = await LibellumTestValuesFrom(accounts, goal, individualCap);
    });

    describe('when crowdsale has not started', function () {
        it('whitelisted beneficiary is not able to buy', async function () {
            await expectThrow(this.values.libellumCrowdsale.buyTokens(this.values.whitelistedBeneficiary, {value: ether(10), from: this.values.whitelistedBeneficiary}));
        });
    });

    describe('when crowdsale has started', function () {
        it('whitelisted beneficiary is able to buy tokens but tokens are not avaialble before finish', async function () {
            await this.values.increaseTimeToPhase1();
            await this.values.libellumCrowdsale.buyTokens(this.values.whitelistedBeneficiary, {value: ether(10), from: this.values.whitelistedBeneficiary});
            (await this.values.libellumToken.balanceOf(this.values.whitelistedBeneficiary)).should.be.bignumber.equal(0 * LIB);
        });

        it('whitelisted beneficiary is able to buy tokens but not able to withdraw tokens since the goal is not reached even if end date is reached', async function () {
            await this.values.increaseTimeToPhase1();
            await this.values.libellumCrowdsale.buyTokens(this.values.whitelistedBeneficiary, {value: ether(10), from: this.values.whitelistedBeneficiary});
            await this.values.increaseTimeToAfterTheEnd();
            await expectThrow(this.values.libellumCrowdsale.withdrawTokens({from: this.values.whitelistedBeneficiary}));
        });

        it('whitelisted beneficiary is able to buy tokens and they are available if goal is reached and if end date is reached', async function () {
            await this.values.increaseTimeToPhase1();
            await this.values.libellumCrowdsale.buyTokens(this.values.whitelistedBeneficiary, {value: goal, from: this.values.whitelistedBeneficiary});
            await this.values.increaseTimeToAfterTheEnd();
            await this.values.libellumCrowdsale.withdrawTokens({from: this.values.whitelistedBeneficiary});
            (await this.values.libellumToken.balanceOf(this.values.whitelistedBeneficiary)).should.be.bignumber.equal(80 * LIB);
        });
    });
});