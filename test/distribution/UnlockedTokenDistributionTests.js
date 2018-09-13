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
    let individualCap = ether(40);

    beforeEach(async function () {
        this.values = await LibellumTestValuesFrom(accounts, goal, individualCap);
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
                await this.airdrop.doAirdrop([this.values.airdropRecepient], [200], {from: this.values.owner});
                (await this.values.libellumToken.balanceOf(this.values.airdropRecepient)).should.be.bignumber.equal(200);
            });

            it('Non-owner is not able to distribute Airdrop funds', async function () {
                await expectThrow(this.airdrop.doAirdrop([this.values.airdropRecepient], [200], {from: this.values.airdropRecepient}));
            });
        });
    });
});