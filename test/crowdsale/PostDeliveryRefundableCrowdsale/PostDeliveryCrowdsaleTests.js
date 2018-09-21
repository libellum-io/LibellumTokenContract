const { LibellumTestValuesFrom, InitPhase1Rate } = require("../../TestFactory.js");
const { expectThrow } = require('../../helpers/expectThrow.js');
const { ether } = require('../../helpers/ether.js');
const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-bignumber')(BigNumber))
    .should();

contract('TokenBuyingTests', function (accounts) {
    let goal = ether(20);
    let defaultIndividualCap = ether(40);

    beforeEach(async function () {
        this.values = await LibellumTestValuesFrom(accounts, goal, defaultIndividualCap);
        await this.values.increaseTimeToPhase1();
    });

    describe('when goal is reached but crowdsale is still in progress', function () {
        beforeEach(async function () {
            await this.values.libellumCrowdsale.buyTokens(this.values.whitelistedBeneficiary, {value: ether(20), from: this.values.whitelistedBeneficiary});
        });

        it('beneficiary should not be able to withdraw tokens', async function () {
            await expectThrow(this.values.libellumCrowdsale.withdrawTokens({from: this.values.whitelistedBeneficiary}));
            (await this.values.libellumToken.balanceOf(this.values.whitelistedBeneficiary)).should.be.bignumber.equal(0);
        });
    });

    describe('when crowdsale is finished but goal is not reached', function () {
        beforeEach(async function () {
            await this.values.libellumCrowdsale.buyTokens(this.values.whitelistedBeneficiary, {value: ether(10), from: this.values.whitelistedBeneficiary});
            await this.values.increaseTimeToAfterTheEnd();
        });

        it('beneficiary should not be able to withdraw tokens', async function () {
            await expectThrow(this.values.libellumCrowdsale.withdrawTokens({from: this.values.whitelistedBeneficiary}));
            (await this.values.libellumToken.balanceOf(this.values.whitelistedBeneficiary)).should.be.bignumber.equal(0);
        });
    });

    describe('when crowdsale is finished and goal is reached', function () {
        beforeEach(async function () {
            await this.values.libellumCrowdsale.buyTokens(this.values.whitelistedBeneficiary, {value: ether(20), from: this.values.whitelistedBeneficiary});
            await this.values.increaseTimeToAfterTheEnd();
        });

        it('beneficiary should be able to withdraw tokens', async function () {
            await this.values.libellumCrowdsale.withdrawTokens({from: this.values.whitelistedBeneficiary});
            (await this.values.libellumToken.balanceOf(this.values.whitelistedBeneficiary)).should.be.bignumber.equal(ether(20) * InitPhase1Rate);
        });

        describe('after crowdsale is finalized', function () {
            beforeEach(async function () {
                await this.values.libellumCrowdsale.finalize({from: owner});
            });

            it('beneficiary should not be able to withdraw tokens since owner of the token is distribution tokens', async function () {
                await expectThrow(this.values.libellumCrowdsale.withdrawTokens({from: this.values.whitelistedBeneficiary}));
                (await this.values.libellumToken.balanceOf(this.values.whitelistedBeneficiary)).should.be.bignumber.equal(0);
            });

            describe('after tokens are distributed', function () {
                beforeEach(async function () {
                    await this.values.libellumTokenDistribution.distribute({from: owner});
                });

                it('beneficiary should be able to withdraw tokens', async function () {
                    await this.values.libellumCrowdsale.withdrawTokens({from: this.values.whitelistedBeneficiary});
                    (await this.values.libellumToken.balanceOf(this.values.whitelistedBeneficiary)).should.be.bignumber.equal(ether(20) * InitPhase1Rate);
                });
            })
        });
    });
});