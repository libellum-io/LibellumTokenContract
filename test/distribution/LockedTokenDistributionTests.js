var LibellumTokenDistribution = artifacts.require("./distribution/LibellumTokenDistribution.sol");

const { LibellumTestValuesFrom, LIB, Mio, ZeroAddress } = require("../TestFactory.js");
const { expectThrow } = require('../helpers/expectThrow.js');
const { ether } = require('../helpers/ether.js');
const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-bignumber')(BigNumber))
    .should();

contract('LockedTokenDistribution', function (accounts) {

    describe('validation during construction', function () {
        let owner = accounts[0];

        it('when two valid founders and advisors are passed contract is created', async function () {
            let founders = [accounts[1], accounts[2]];
            let advisors = [accounts[3], accounts[4]];
            this.libellumTokenDistribution = await LibellumTokenDistribution.new(founders, advisors, {from: owner});

            this.libellumTokenDistribution.should.not.equal(ZeroAddress);
        });

        it('when founders array length is not 2 transaction is reverted', async function () {
            let founders = [accounts[1]];
            let advisors = [accounts[3], accounts[4]];
            await expectThrow(LibellumTokenDistribution.new(founders, advisors, {from: owner}));
        });

        it('when advisors array length is not 2 transaction is reverted', async function () {
            let founders = [accounts[1], accounts[2]];
            let advisors = [accounts[3], accounts[4], accounts[5]];
            await expectThrow(LibellumTokenDistribution.new(founders, advisors, {from: owner}));
        });

        it('when founders array contains zero address transaction is reverted', async function () {
            let founders = [accounts[1], ZeroAddress];
            let advisors = [accounts[3], accounts[4]];
            await expectThrow(LibellumTokenDistribution.new(founders, advisors, {from: owner}));
        });

        it('when founders array contains zero address transaction is reverted', async function () {
            let founders = [accounts[1], accounts[2]];
            let advisors = [ZeroAddress, accounts[4]];
            await expectThrow(LibellumTokenDistribution.new(founders, advisors, {from: owner}));
        });
    });

    describe("token distribution", function () {
        let goal = ether(20);
        let individualCap = ether(40);

        beforeEach(async function () {
            this.values = await LibellumTestValuesFrom(accounts, goal, individualCap);
        });
    
        it ('founders and advisors addresses are correct', async function () {
            (await this.values.libellumTokenDistribution.addresses.call(0)).should.be.equal(this.values.founder1);
            (await this.values.libellumTokenDistribution.addresses.call(1)).should.be.equal(this.values.founder2);
            (await this.values.libellumTokenDistribution.addresses.call(2)).should.be.equal(this.values.advisor1);
            (await this.values.libellumTokenDistribution.addresses.call(3)).should.be.equal(this.values.advisor2);
        });
    
        describe('when crowdsale is finalized and goal is not reached', function ()
        {
            beforeEach(async function () {
                await this.values.increaseTimeToPhase1();
                await this.values.libellumCrowdsale.buyTokens(this.values.whitelistedBeneficiary, {value: ether(10), from: this.values.whitelistedBeneficiary});
                await this.values.increaseTimeToAfterTheEnd();
                await this.values.libellumCrowdsale.finalize();
            });
    
            it('founders and advisors balances contain zero LIBs', async function () {
                (await this.values.libellumToken.balanceOf(this.values.founder1)).should.be.bignumber.equal(0 * LIB);
                (await this.values.libellumToken.balanceOf(this.values.founder2)).should.be.bignumber.equal(0 * LIB);
                (await this.values.libellumToken.balanceOf(this.values.advisor1)).should.be.bignumber.equal(0 * LIB);
                (await this.values.libellumToken.balanceOf(this.values.advisor2)).should.be.bignumber.equal(0 * LIB);
            });
        });
    
        describe('when corwdsale is finalized and goal is reached', function () {
            beforeEach(async function () {
                await this.values.increaseTimeToPhase1();
                await this.values.libellumCrowdsale.buyTokens(this.values.whitelistedBeneficiary, {value: goal, from: this.values.whitelistedBeneficiary});
                await this.values.increaseTimeToAfterTheEnd();
                await this.values.libellumCrowdsale.finalize();
            });
    
            it('founders and advisors balances contain correct number of LIBs', async function () {
                (await this.values.libellumToken.balanceOf(this.values.founder1)).should.be.bignumber.equal(2.5 * Mio * LIB);
                (await this.values.libellumToken.balanceOf(this.values.founder2)).should.be.bignumber.equal(2.5 * Mio * LIB);
                (await this.values.libellumToken.balanceOf(this.values.advisor1)).should.be.bignumber.equal(1.25 * Mio * LIB);
                (await this.values.libellumToken.balanceOf(this.values.advisor2)).should.be.bignumber.equal(1.25 * Mio * LIB);
            });
    
            describe('tocken timelocks', function () {
                beforeEach(async function () {
                    this.founder1TockenTimelock = await this.values.libellumTokenDistribution.tokenTimelocks.call(0);
                    this.founder2TockenTimelock = await this.values.libellumTokenDistribution.tokenTimelocks.call(1);
                    this.advisor1TockenTimelock = await this.values.libellumTokenDistribution.tokenTimelocks.call(2);
                    this.advisor2TockenTimelock = await this.values.libellumTokenDistribution.tokenTimelocks.call(3);
                });
                
                it('founders and advisors timelocks contain correct funds', async function () {
                    (await this.values.libellumToken.balanceOf(this.founder1TockenTimelock)).should.be.bignumber.equal(2.5 * Mio * LIB);
                    (await this.values.libellumToken.balanceOf(this.founder2TockenTimelock)).should.be.bignumber.equal(2.5 * Mio * LIB);
                    (await this.values.libellumToken.balanceOf(this.advisor1TockenTimelock)).should.be.bignumber.equal(1.25 * Mio * LIB);
                    (await this.values.libellumToken.balanceOf(this.advisor2TockenTimelock)).should.be.bignumber.equal(1.25 * Mio * LIB);
                });
            });
        });
    });
});