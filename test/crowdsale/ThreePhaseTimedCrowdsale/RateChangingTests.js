const { LibellumTestValuesFrom, InitPhase1Rate, InitPhase2Rate, InitPhase3Rate } = require("../../TestFactory.js");
const { expectThrow } = require('../../helpers/expectThrow.js');
const { ether } = require('../../helpers/ether.js');
const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-bignumber')(BigNumber))
    .should();

contract('RateChangingTests', function (accounts) {
    let goal = ether(20);
    let defaultIndividualCap = ether(40);

    beforeEach(async function () {
        this.values = await LibellumTestValuesFrom(accounts, goal, defaultIndividualCap);
    });

    describe('crowdsale has not started', function () {
        it('Phase 1, 2 and 3 rates are set to initial values', async function () {
            (await this.values.libellumCrowdsale.ratesByPhase.call(1)).should.be.bignumber.equal(InitPhase1Rate);
            (await this.values.libellumCrowdsale.ratesByPhase.call(2)).should.be.bignumber.equal(InitPhase2Rate);
            (await this.values.libellumCrowdsale.ratesByPhase.call(3)).should.be.bignumber.equal(InitPhase3Rate);
        });

        it('not able to change phase 2 and phase 3 rates', async function () {
            await expectThrow(this.values.libellumCrowdsale.updatePhase2Rate(1000, {from: this.values.owner}));
            await expectThrow(this.values.libellumCrowdsale.updatePhase3Rate(1000, {from: this.values.owner}));
        });
    });

    describe('crowdsale phase is 1 in progress', function () {
        beforeEach(async function () {
            await this.values.increaseTimeToPhase1();
        });

        it('Phase 2 rate can be changed by the owner', async function () {
            await this.values.libellumCrowdsale.updatePhase2Rate(1000, {from: this.values.owner});
            
            (await this.values.libellumCrowdsale.ratesByPhase.call(1)).should.be.bignumber.equal(InitPhase1Rate);
            (await this.values.libellumCrowdsale.ratesByPhase.call(2)).should.be.bignumber.equal(1000);
            (await this.values.libellumCrowdsale.ratesByPhase.call(3)).should.be.bignumber.equal(InitPhase3Rate);
        });

        it('Phase 2 rate cant be changed by someone who is not owner', async function () {
            await expectThrow(this.values.libellumCrowdsale.updatePhase2Rate(1000, {from: this.values.whitelistedBeneficiary}));
        });

        it('not able to change phase phase 3 rate', async function () {
            await expectThrow(this.values.libellumCrowdsale.updatePhase3Rate(1000, {from: this.values.owner}));
        });
    });

    describe('crowdsale phase 2 is in progress', function () {
        beforeEach(async function () {
            await this.values.increaseTimeToPhase2();
        });

        it('Phase 3 rate can be changed by the owner', async function () {
            await this.values.libellumCrowdsale.updatePhase3Rate(500, {from: this.values.owner});
            
            (await this.values.libellumCrowdsale.ratesByPhase.call(1)).should.be.bignumber.equal(InitPhase1Rate);
            (await this.values.libellumCrowdsale.ratesByPhase.call(2)).should.be.bignumber.equal(InitPhase2Rate);
            (await this.values.libellumCrowdsale.ratesByPhase.call(3)).should.be.bignumber.equal(500);
        });

        it('Phase 3 rate cant be changed by someone who is not owner', async function () {
            await expectThrow(this.values.libellumCrowdsale.updatePhase3Rate(500, {from: this.values.whitelistedBeneficiary}));
        });

        it('not able to change phase phase 2 rate', async function () {
            await expectThrow(this.values.libellumCrowdsale.updatePhase2Rate(500, {from: this.values.owner}));
        });
    });

    describe('crowdsale phase 3 is in progress', function () {
        beforeEach(async function () {
            await this.values.increaseTimeToPhase3();
        });

        it('not able to change phase 2 and phase 3 rates', async function () {
            await expectThrow(this.values.libellumCrowdsale.updatePhase2Rate(1000, {from: this.values.owner}));
            await expectThrow(this.values.libellumCrowdsale.updatePhase3Rate(1000, {from: this.values.owner}));
        });
    });
});