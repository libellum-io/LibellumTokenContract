const { LibellumTestValuesUsing, UtcDateFrom, LIB } = require("./TestFactory.js");
const { expectThrow } = require('./helpers/expectThrow.js');
const { ether } = require('./helpers/ether.js');
const { increaseTimeTo, duration } = require('./helpers/increaseTime');
const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-bignumber')(BigNumber))
    .should();

contract('LibellumCrowdsale', function (accounts) {
    const beneficiaryCap = ether(50);
    const etherAmount = ether(42);

    beforeEach(async function () {
        this.values = await LibellumTestValuesUsing(accounts);
    });

    describe('buy tokens when user is whitelisted', function () {
        beforeEach(async function () {
            await this.values.libellumCrowdsaleContract.addToWhitelist(this.values.beneficiary, beneficiaryCap, {from: this.values.owner})
        });

        describe('when crowdsale has not started', function () {
            it('beneficiary is not able to buy', async function () {
                await expectThrow(this.values.libellumCrowdsaleContract.buyTokens(this.values.beneficiary, {value: etherAmount, from: this.values.beneficiary}));
            });
        });

        describe('when crowdsale has started', function () {
            it('beneficiary is able to buy tokens but tokens are not avaialble before finish', async function () {
                await increaseTimeTo(UtcDateFrom(1, 10, 2018));
                await this.values.libellumCrowdsaleContract.buyTokens(this.values.beneficiary, {value: etherAmount, from: this.values.beneficiary});
                (await this.values.libellumTokenContract.balanceOf(this.values.beneficiary)).should.be.bignumber.equal(0 * LIB);
            });

            it('beneficiary is able to buy tokens and they are still not available if goal is not reached even if end date is reached', async function () {
                await increaseTimeTo(UtcDateFrom(3, 10, 2018));
                await this.values.libellumCrowdsaleContract.buyTokens(this.values.beneficiary, {value: etherAmount, from: this.values.beneficiary});
                await increaseTimeTo(UtcDateFrom(1, 12, 2019));
                await this.values.libellumCrowdsaleContract.withdrawTokens({from: this.values.beneficiary});
                (await this.values.libellumTokenContract.balanceOf(this.values.beneficiary)).should.be.bignumber.equal(0 * LIB);
            });

            it('beneficiary is able to buy tokens and they are available if goal is reached if end date is reached', async function () {
                await increaseTimeTo(UtcDateFrom(3, 10, 2018));
                await this.values.libellumCrowdsaleContract.buyTokens(this.values.beneficiary, {value: ether(200), from: this.values.beneficiary});
                await increaseTimeTo(UtcDateFrom(1, 12, 2019));
                await this.values.libellumCrowdsaleContract.withdrawTokens({from: this.values.beneficiary});
                (await this.values.libellumTokenContract.balanceOf(this.values.beneficiary)).should.be.bignumber.equal(400 * LIB);
            });
        });
    });
});