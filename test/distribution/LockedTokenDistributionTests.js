var LibellumTokenDistribution = artifacts.require("./distribution/LibellumTokenDistribution.sol");
var TokenTimelock = artifacts.require("openzeppelin-solidity/contracts/token/ERC20/TokenTimelock.sol");

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
        let founder1 = accounts[1];
        let founder2 = accounts[2];
        let advisor1 = accounts[3];
        let advisor2 = accounts[4];

        it('when two valid founders and advisors are passed contract is created', async function () {
            await LibellumTokenDistribution.new(founder1, founder2, advisor1, advisor2, {from: owner});
        });

        it('when any address is zero transaction is reverted', async function () {
            await expectThrow(LibellumTokenDistribution.new(ZeroAddress, founder2, advisor1, advisor2, {from: owner}));
            await expectThrow(LibellumTokenDistribution.new(founder1, ZeroAddress, advisor1, advisor2, {from: owner}));
            await expectThrow(LibellumTokenDistribution.new(founder1, founder2, ZeroAddress, advisor2, {from: owner}));
            await expectThrow(LibellumTokenDistribution.new(founder1, founder2, advisor1, ZeroAddress, {from: owner}));
        });
    });

    describe("token distribution", function () {
        let goal = ether(20);
        let defaultIndividualCap = ether(40);

        beforeEach(async function () {
            this.values = await LibellumTestValuesFrom(accounts, goal, defaultIndividualCap);
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
    
        describe('when crowdsale is finalized and goal is reached', function () {
            beforeEach(async function () {
                await this.values.increaseTimeToPhase1();
                await this.values.libellumCrowdsale.buyTokens(this.values.whitelistedBeneficiary, {value: goal, from: this.values.whitelistedBeneficiary});
                await this.values.increaseTimeToAfterTheEnd();
                await this.values.libellumCrowdsale.finalize();
                await this.values.libellumTokenDistribution.distribute();
            });
    
            it('founders and advisors balances contain correct number of LIBs', async function () {
                (await this.values.libellumToken.balanceOf(this.values.founder1)).should.be.bignumber.equal(2.5 * Mio * LIB);
                (await this.values.libellumToken.balanceOf(this.values.founder2)).should.be.bignumber.equal(2.5 * Mio * LIB);
                (await this.values.libellumToken.balanceOf(this.values.advisor1)).should.be.bignumber.equal(1.25 * Mio * LIB);
                (await this.values.libellumToken.balanceOf(this.values.advisor2)).should.be.bignumber.equal(1.25 * Mio * LIB);
            });
    
            describe('tocken timelocks', function () {
                beforeEach(async function () {
                    this.founder1TockenTimelock = TokenTimelock.at(await this.values.libellumTokenDistribution.tokenTimelocks.call(0));
                    this.founder2TockenTimelock = TokenTimelock.at(await this.values.libellumTokenDistribution.tokenTimelocks.call(1));
                    this.advisor1TockenTimelock = TokenTimelock.at(await this.values.libellumTokenDistribution.tokenTimelocks.call(2));
                    this.advisor2TockenTimelock = TokenTimelock.at(await this.values.libellumTokenDistribution.tokenTimelocks.call(3));
                });
                
                it('founders and advisors timelocks contain correct funds', async function () {
                    (await this.values.libellumToken.balanceOf(this.founder1TockenTimelock.address)).should.be.bignumber.equal(2.5 * Mio * LIB);
                    (await this.values.libellumToken.balanceOf(this.founder2TockenTimelock.address)).should.be.bignumber.equal(2.5 * Mio * LIB);
                    (await this.values.libellumToken.balanceOf(this.advisor1TockenTimelock.address)).should.be.bignumber.equal(1.25 * Mio * LIB);
                    (await this.values.libellumToken.balanceOf(this.advisor2TockenTimelock.address)).should.be.bignumber.equal(1.25 * Mio * LIB);
                });

                describe('no time passed after the crowdsale', function () {
                    it('founders are not able to release tokens', async function () {
                        await expectThrow(this.founder1TockenTimelock.release({from: this.values.founder1}));
                        await expectThrow(this.founder2TockenTimelock.release({from: this.values.founder2}));
                        (await this.values.libellumToken.balanceOf(this.values.founder1)).should.be.bignumber.equal(2.5 * Mio * LIB);
                        (await this.values.libellumToken.balanceOf(this.values.founder2)).should.be.bignumber.equal(2.5 * Mio * LIB);
                    });

                    it('advisors are not able to release tokens', async function () {
                        await expectThrow(this.advisor1TockenTimelock.release({from: this.values.founder1}));
                        await expectThrow(this.advisor2TockenTimelock.release({from: this.values.founder2}));
                        (await this.values.libellumToken.balanceOf(this.values.advisor1)).should.be.bignumber.equal(1.25 * Mio * LIB);
                        (await this.values.libellumToken.balanceOf(this.values.advisor2)).should.be.bignumber.equal(1.25 * Mio * LIB);
                    });
                });

                describe('6 months passed after the crowdsale', function () {
                    beforeEach(async function () {
                        await this.values.increaseTimeSixMonthsAfterTheEnd();
                    });

                    it('advisors are able to release tokens', async function () {
                        await this.advisor1TockenTimelock.release({from: this.values.founder1});
                        await this.advisor2TockenTimelock.release({from: this.values.founder2});
                        (await this.values.libellumToken.balanceOf(this.values.advisor1)).should.be.bignumber.equal(2.5 * Mio * LIB);
                        (await this.values.libellumToken.balanceOf(this.values.advisor2)).should.be.bignumber.equal(2.5 * Mio * LIB);
                    });
                });

                describe('one year passed after the crowdsale', function () {
                    beforeEach(async function () {
                        await this.values.increaseTimeOneYearAfterTheEnd();
                    });

                    it('founders are able to release tokens', async function () {
                        await this.founder1TockenTimelock.release({from: this.values.founder1});
                        await this.founder2TockenTimelock.release({from: this.values.founder2});
                        (await this.values.libellumToken.balanceOf(this.values.founder1)).should.be.bignumber.equal(5 * Mio * LIB);
                        (await this.values.libellumToken.balanceOf(this.values.founder2)).should.be.bignumber.equal(5 * Mio * LIB);
                    });
                });
            });
        });
    });
});