const { LibellumTestValuesFrom } = require("../../TestFactory.js");
const { expectThrow } = require('../../helpers/expectThrow.js');
const { ether } = require('../../helpers/ether.js');
const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-bignumber')(BigNumber))
    .should();

contract('MinimumWeiAmountsTests', function (accounts) {
    let goal = ether(20);
    let defaultIndividualCap = ether(40);

    beforeEach(async function () {
        this.values = await LibellumTestValuesFrom(accounts, goal, defaultIndividualCap);
    });

    describe('crowdsale phase is 1 in progress', function () {
        beforeEach(async function () {
            await this.values.increaseTimeToPhase1();
        });

        it('not able to buy tokens for 4.99 ether', async function () {
            await expectThrow(this.values.libellumCrowdsale.buyTokens(this.values.whitelistedBeneficiary, {value: ether(4.99), from: this.values.whitelistedBeneficiary}));
        });

        it('able to buy tokens for 5 ether', async function () {
            await this.values.libellumCrowdsale.buyTokens(this.values.whitelistedBeneficiary, {value: ether(5), from: this.values.whitelistedBeneficiary});
        });
    });

    describe('crowdsale phase 2 is in progress', function () {
        beforeEach(async function () {
            await this.values.increaseTimeToPhase2();
        });

        it('not able to buy tokens for 0.09 ether', async function () {
            await expectThrow(this.values.libellumCrowdsale.buyTokens(this.values.whitelistedBeneficiary, {value: ether(0.09), from: this.values.whitelistedBeneficiary}));
        });

        it('able to buy tokens for 0.1 ether', async function () {
            await this.values.libellumCrowdsale.buyTokens(this.values.whitelistedBeneficiary, {value: ether(0.1), from: this.values.whitelistedBeneficiary});
        });
    });

    describe('crowdsale phase 3 is in progress', function () {
        beforeEach(async function () {
            await this.values.increaseTimeToPhase3();
        });

        it('not able to buy tokens for 0.09 ether', async function () {
            await expectThrow(this.values.libellumCrowdsale.buyTokens(this.values.whitelistedBeneficiary, {value: ether(0.09), from: this.values.whitelistedBeneficiary}));
        });

        it('able to buy tokens for 0.1 ether', async function () {
            await this.values.libellumCrowdsale.buyTokens(this.values.whitelistedBeneficiary, {value: ether(0.1), from: this.values.whitelistedBeneficiary});
        });
    });
});