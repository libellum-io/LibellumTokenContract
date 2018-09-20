var UnlockedTokenDistribution = artifacts.require("./distribution/UnlockedTokenDistribution.sol");

const { LibellumTestValuesFrom, LIB, Mio, ZeroAddress } = require("../TestFactory.js");
var Airdrop = artifacts.require("./distribution/Airdrop.sol");
const { expectThrow } = require('../helpers/expectThrow.js');
const { ether } = require('../helpers/ether.js');
const { latestTime } = require('../helpers/latestTime');
const { duration } = require('../helpers/increaseTime');
const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-bignumber')(BigNumber))
    .should();

contract('UnlockedTokenDistribution', function (accounts) {
    let goal = ether(20);
    let defaultIndividualCap = ether(40);

    describe('validation during construction', function () {
        let owner = accounts[0];
        let bountyPool = accounts[1];
        let rAndDPool = accounts[2];
        let teamReserveFund = accounts[3];

        // it('when valid addresses and date are passed contract is created', async function () {
        //     this.unlockedTokenDistribution = await UnlockedTokenDistribution.new(await latestTime() + duration.days(1), bountyPool, rAndDPool, teamReserveFund, {from: owner});
        //     this.unlockedTokenDistribution.should.not.equal(ZeroAddress);
        // });

        // it('when zero bounty pool address is passed transaction is reverted', async function () {
        //     await expectThrow(UnlockedTokenDistribution.new(await latestTime() + duration.days(1), ZeroAddress, rAndDPool, teamReserveFund, {from: owner}));
        // });

        // it('when zero R&D pool address is passed transaction is reverted', async function () {
        //     await expectThrow(UnlockedTokenDistribution.new(await latestTime() + duration.days(1), bountyPool, ZeroAddress, teamReserveFund, {from: owner}));
        // });

        // it('when zero team reserve fund address is passed transaction is reverted', async function () {
        //     await expectThrow(UnlockedTokenDistribution.new(await latestTime() + duration.days(1), bountyPool, rAndDPool, ZeroAddress, {from: owner}));
        // });

        // it('when updateAirdropTokenAmountEndDate is from the past transaction is reverted', async function () {
        //     await expectThrow(UnlockedTokenDistribution.new(await latestTime() - duration.days(1), bountyPool, rAndDPool, teamReserveFund, {from: owner}));
        // });
    });

    describe("token distribution", function () {
        beforeEach(async function () {
            this.values = await LibellumTestValuesFrom(accounts, goal, defaultIndividualCap);
            await this.values.increaseTimeToPhase1();
            await this.values.libellumCrowdsale.buyTokens(this.values.whitelistedBeneficiary, {value: goal, from: this.values.whitelistedBeneficiary});
            await this.values.increaseTimeToAfterTheEnd();
            await this.values.libellumCrowdsale.finalize();
        });
    
        describe('before token distribution is triggered', function () {
            describe('Airdrop', function () {
                beforeEach(async function () {
                    this.airdrop = Airdrop.at(await this.values.libellumTokenDistribution.airdrop.call());
                });
                
                it('airdrop contract address is 0', function () {
                    this.airdrop.address.should.be.equal(ZeroAddress);
                });
            });
        });
    
        describe('after token distribution is triggered', function () {
            beforeEach(async function () {
                await this.values.libellumTokenDistribution.distribute();
            });
    
            describe('Airdrop', function () {
                beforeEach(async function () {
                    this.airdrop = Airdrop.at(await this.values.libellumTokenDistribution.airdrop.call());
                });
    
                it('airdrop contract address is not 0', function () {
                    this.airdrop.address.should.not.equal(ZeroAddress);
                });
    
                it('airdrop contract has 2.5 Mio LIB before doAirdrop() is called', async function () {
                    (await this.values.libellumToken.balanceOf(this.airdrop.address)).should.be.bignumber.equal(2.5 * Mio * LIB);
                });
                
                it('LibellumTokenDistribution owner is able to distribute Airdrop funds', async function () {
                    await this.airdrop.doAirdrop([this.values.airdropRecipient], [200], {from: this.values.owner});
                    (await this.values.libellumToken.balanceOf(this.values.airdropRecipient)).should.be.bignumber.equal(200);
                });
    
                it('Non-owner is not able to distribute Airdrop funds', async function () {
                    await expectThrow(this.airdrop.doAirdrop([this.values.airdropRecipient], [200], {from: this.values.airdropRecipient}));
                });
            });
    
            describe('Other tokens distribution', function () {
                it('bounty pool balance should be 2.5 Mio LIB', async function () {
                    (await this.values.libellumToken.balanceOf(this.values.bountyPool)).should.be.bignumber.equal(2.5 * Mio * LIB);
                });
    
                it('R&D pool balance should be 15 Mio LIB', async function () {
                    (await this.values.libellumToken.balanceOf(this.values.rAndDPool)).should.be.bignumber.equal(15 * Mio * LIB);
                });
    
                it('Team-Reserve fund balance should be 15 Mio LIB', async function () {
                    (await this.values.libellumToken.balanceOf(this.values.teamReserveFund)).should.be.bignumber.equal(15 * Mio * LIB);
                });
            });
        });
    });

    describe("updating token amount for airdrop", function () {
        beforeEach(async function () {
            this.values = await LibellumTestValuesFrom(accounts, goal, defaultIndividualCap);
        });

        describe('before updating period is finished', function () {
            beforeEach(async function () {
                await this.values.increaseTimeToPhase2();
            });

            it('airdropTokens is successfully updated for 2 Mio LIB', async function () {
                await this.values.libellumCrowdsale.updateTokenAmountForAirdrop(2 * Mio * LIB, {from: this.values.owner});
                (await this.values.libellumTokenDistribution.airdropTokens.call()).should.be.bignumber.equal(2 * Mio * LIB);
            });

            it('transaction reverted if update is tried with value above 2.5 Mio LIB', async function () {
                await expectThrow(this.values.libellumCrowdsale.updateTokenAmountForAirdrop(2.6 * Mio * LIB, {from: this.values.owner}));
                (await this.values.libellumTokenDistribution.airdropTokens.call()).should.be.bignumber.equal(2.5 * Mio * LIB);
            });

            it('after crowdsale has been finished updated amount of airdrop tokens are actually delivered to airdrop contract', async function () {
                await this.values.libellumCrowdsale.updateTokenAmountForAirdrop(2 * Mio * LIB, {from: this.values.owner});
                await this.values.libellumCrowdsale.buyTokens(this.values.whitelistedBeneficiary, {value: goal, from: this.values.whitelistedBeneficiary});
                await this.values.increaseTimeToAfterTheEnd();
                await this.values.libellumCrowdsale.finalize();
                await this.values.libellumTokenDistribution.distribute();
                let airdrop = Airdrop.at(await this.values.libellumTokenDistribution.airdrop.call());
                (await this.values.libellumToken.balanceOf(airdrop.address)).should.be.bignumber.equal(2.0 * Mio * LIB);
            });
        });

        describe('after updating period is finished', function () {
            beforeEach(async function () {
                await this.values.increaseTimeToPhase3();
            });

            it('transaction is reverted for 2 Mio LIB (or any other)', async function () {
                await expectThrow(this.values.libellumCrowdsale.updateTokenAmountForAirdrop(2 * Mio * LIB, {from: this.values.owner}));
            });
        });
        
    });
});