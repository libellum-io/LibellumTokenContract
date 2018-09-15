const { LibellumTestValuesFrom, InitPhase1Rate, InitPhase2Rate, InitPhase3Rate } = require("../../TestFactory.js");
const { expectThrow } = require('../../helpers/expectThrow.js');
const { ether } = require('../../helpers/ether.js');
const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-bignumber')(BigNumber))
    .should();

contract('TokenBuyingTests', function (accounts) {
    let goal = ether(20);
    let individualCap = ether(40);

    beforeEach(async function () {
        this.values = await LibellumTestValuesFrom(accounts, goal, individualCap);
    });

    describe('crowdsale has not started', function () {
        it('not able to execute payment', async function () {
            await expectThrow(this.values.libellumCrowdsale.buyTokens(this.values.whitelistedBeneficiary, {value: ether(10), from: this.values.whitelistedBeneficiary}));
        });
    });

    describe('crowdsale phase is 1 in progress', function () {
        beforeEach(async function () {
            await this.values.increaseTimeToPhase1();
        });

        it('payment executed with correct amount of LIB tokens promised to investor', async function () {
            await this.values.libellumCrowdsale.buyTokens(this.values.whitelistedBeneficiary, {value: ether(10), from: this.values.whitelistedBeneficiary});
            
            (await this.values.libellumCrowdsale.balances.call(this.values.whitelistedBeneficiary)).should.be.bignumber.equal(ether(10) * InitPhase1Rate);
        });
    });

    describe('crowdsale phase 2 is in progress', function () {
        beforeEach(async function () {
            await this.values.increaseTimeToPhase2();
        });

        it('payment executed with correct amount of LIB tokens promised to investor', async function () {
            await this.values.libellumCrowdsale.buyTokens(this.values.whitelistedBeneficiary, {value: ether(10), from: this.values.whitelistedBeneficiary});
            
            (await this.values.libellumCrowdsale.balances.call(this.values.whitelistedBeneficiary)).should.be.bignumber.equal(ether(10) * InitPhase2Rate);
        });
    });

    describe('crowdsale phase 3 is in progress', function () {
        beforeEach(async function () {
            await this.values.increaseTimeToPhase3();
        });

        it('payment executed with correct amount of LIB tokens promised to investor', async function () {
            await this.values.libellumCrowdsale.buyTokens(this.values.whitelistedBeneficiary, {value: ether(10), from: this.values.whitelistedBeneficiary});
            
            (await this.values.libellumCrowdsale.balances.call(this.values.whitelistedBeneficiary)).should.be.bignumber.equal(ether(10) * InitPhase3Rate);
        });
    });

    describe('crowdsale ended', function () {
        beforeEach(async function () {
            await this.values.increaseTimeToAfterTheEnd();
        });

        it('not able to execute payment', async function () {
            await expectThrow(this.values.libellumCrowdsale.buyTokens(this.values.whitelistedBeneficiary, {value: ether(10), from: this.values.whitelistedBeneficiary}));
        });
    });
});