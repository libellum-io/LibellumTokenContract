const { LibellumTestValuesFrom, InitPhase1Rate } = require("../../TestFactory.js");
const { expectThrow } = require('../../helpers/expectThrow.js');
const { ether } = require('../../helpers/ether.js');
const { ethGetBalance } = require('../../helpers/web3');
const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-bignumber')(BigNumber))
    .should();

contract('RefundableCrowdsaleTests', function (accounts) {
    let goal = ether(20);
    let defaultIndividualCap = ether(40);

    beforeEach(async function () {
        this.values = await LibellumTestValuesFrom(accounts, goal, defaultIndividualCap);
        this.fundsWalletOriginalBalance = await ethGetBalance(this.values.fundsWallet);
        await this.values.increaseTimeToPhase1();
    });

    describe('when goal is not reached and crowdsale has been finalized', function () {
        beforeEach(async function () {
            await this.values.libellumCrowdsale.buyTokens(this.values.whitelistedBeneficiary, {value: ether(10), from: this.values.whitelistedBeneficiary});
            await this.values.increaseTimeToAfterTheEnd();
            await this.values.libellumTokenDistribution.transferOwnership(this.values.libellumCrowdsale.address, {from: this.values.owner});
            await this.values.libellumCrowdsale.finalize({from: this.values.owner});
        });

        it('beneficiary should be able to refund all funds', async function () {
            const pre = await ethGetBalance(this.values.whitelistedBeneficiary);
            await this.values.libellumCrowdsale.claimRefund({from: this.values.whitelistedBeneficiary, gasPrice: 0});
            const post = await ethGetBalance(this.values.whitelistedBeneficiary);
            post.minus(pre).should.be.bignumber.equal(ether(10));
        });

        it("funds wallet should not receive invested ethers", async function () {
            let fundsWalletBalance = await ethGetBalance(this.values.fundsWallet);
            fundsWalletBalance.minus(this.fundsWalletOriginalBalance).should.be.bignumber.equal(0);
        });
    });

    describe('when goal is reached but crowdsale has not been finalized', function () {
        beforeEach(async function () {
            await this.values.libellumCrowdsale.buyTokens(this.values.whitelistedBeneficiary, {value: ether(20), from: this.values.whitelistedBeneficiary});
            await this.values.increaseTimeToAfterTheEnd();
        });

        it('beneficiary should not be able to refund any funds', async function () {
            const pre = await ethGetBalance(this.values.whitelistedBeneficiary);
            await expectThrow(this.values.libellumCrowdsale.claimRefund({from: this.values.whitelistedBeneficiary, gasPrice: 0}));
            const post = await ethGetBalance(this.values.whitelistedBeneficiary);
            post.minus(pre).should.be.bignumber.equal(0);
        });

        it("funds wallet should not receive invested ethers", async function () {
            let fundsWalletBalance = await ethGetBalance(this.values.fundsWallet);
            fundsWalletBalance.minus(this.fundsWalletOriginalBalance).should.be.bignumber.equal(0);
        });
    });

    describe('when goal is reached and crowdsale has been finalized', function () {
        beforeEach(async function () {
            await this.values.libellumCrowdsale.buyTokens(this.values.whitelistedBeneficiary, {value: ether(20), from: this.values.whitelistedBeneficiary});
            await this.values.increaseTimeToAfterTheEnd();
            await this.values.libellumTokenDistribution.transferOwnership(this.values.libellumCrowdsale.address, {from: this.values.owner});
            await this.values.libellumCrowdsale.finalize({from: this.values.owner});
        });

        it('beneficiary should not be able to refund any funds', async function () {
            const pre = await ethGetBalance(this.values.whitelistedBeneficiary);
            await expectThrow(this.values.libellumCrowdsale.claimRefund({from: this.values.whitelistedBeneficiary, gasPrice: 0}));
            const post = await ethGetBalance(this.values.whitelistedBeneficiary);
            post.minus(pre).should.be.bignumber.equal(0);
        });

        it("funds wallet should receive invested ethers", async function () {
            let fundsWalletBalance = await ethGetBalance(this.values.fundsWallet);
            fundsWalletBalance.minus(this.fundsWalletOriginalBalance).should.be.bignumber.equal(ether(20));
        });
    });
});