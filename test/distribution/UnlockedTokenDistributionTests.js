var UnlockedTokenDistribution = artifacts.require("./distribution/UnlockedTokenDistribution.sol");

const { LibellumTestValuesFrom, LIB, Mio, ZeroAddress } = require("../TestFactory.js");
var Airdrop = artifacts.require("./distribution/Airdrop.sol");
const { expectThrow } = require('../helpers/expectThrow.js');
const { ether } = require('../helpers/ether.js');
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

        it('when valid addresses are passed contract is created', async function () {
            this.unlockedTokenDistribution = await UnlockedTokenDistribution.new(bountyPool, rAndDPool, teamReserveFund, {from: owner});
            this.unlockedTokenDistribution.should.not.equal(ZeroAddress);
        });

        it('when zero bounty pool address is passed transaction is reverted', async function () {
            await expectThrow(UnlockedTokenDistribution.new(ZeroAddress, rAndDPool, teamReserveFund, {from: owner}));
        });

        it('when zero R&D pool address is passed transaction is reverted', async function () {
            await expectThrow(UnlockedTokenDistribution.new(bountyPool, ZeroAddress, teamReserveFund, {from: owner}));
        });

        it('when zero team reserve fund address is passed transaction is reverted', async function () {
            await expectThrow(UnlockedTokenDistribution.new(bountyPool, rAndDPool, ZeroAddress, {from: owner}));
        });
    });

    describe("token distribution", function () {
        beforeEach(async function () {
            this.values = await LibellumTestValuesFrom(accounts, goal, defaultIndividualCap);
            await this.values.increaseTimeToPhase1();
            await this.values.libellumCrowdsale.buyTokens(this.values.whitelistedBeneficiary, {value: goal, from: this.values.whitelistedBeneficiary});
            await this.values.increaseTimeToAfterTheEnd();
        });
    
        describe('before crowdsale is finalized', function () {
            describe('Airdrop', function () {
                beforeEach(async function () {
                    this.airdrop = Airdrop.at(await this.values.libellumTokenDistribution.airdrop.call());
                });
                
                it('airdrop contract address is 0', function () {
                    this.airdrop.address.should.be.equal(ZeroAddress);
                });
            });
        });
    
        describe('after crowdsale is finalized', function () {
            beforeEach(async function () {
                await this.values.libellumCrowdsale.finalize();
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
});