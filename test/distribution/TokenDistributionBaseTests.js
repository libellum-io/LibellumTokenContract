var LibellumToken = artifacts.require("./LibellumToken.sol");
var TokenDistributionBase = artifacts.require("./distribution/TokenDistributionBase.sol");

const { ZeroAddress } = require("../TestFactory.js");
const { latestTime } = require('../helpers/latestTime');
const { duration } = require('../helpers/increaseTime');
const { expectThrow } = require('../helpers/expectThrow.js');
const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-bignumber')(BigNumber))
    .should();

contract('TokenDistributionBase', function (accounts) {
    let owner = accounts[0];

    beforeEach(async function () {
        this.crowdsaleClosingTime = await latestTime() + duration.seconds(30);
        this.libellumToken = await LibellumToken.new({from: owner});
    });

    describe('token distribution construction validation', function () {
        it('if crowdsale closing time is zero transaction is reverted', async function () {
            await expectThrow(TokenDistributionBase.new(this.libellumToken.address, 0, owner, {from: owner}));
        });

        it('if token address is zero transaction is reverted', async function () {
            await expectThrow(TokenDistributionBase.new(ZeroAddress, this.crowdsaleClosingTime, owner, {from: owner}));
        });

        it('if crowdsale contract address is 0 address transaction is reverted', async function () {
            await expectThrow(TokenDistributionBase.new(this.libellumToken.address, this.crowdsaleClosingTime, ZeroAddress, {from: owner}));
        });
    });

    describe('when contract is created', function () {
        beforeEach(async function () {
            this.distributionBase = await TokenDistributionBase.new(this.libellumToken.address, this.crowdsaleClosingTime, owner, {from: owner});
        });

        it('token address is set correctly', async function () {
            (await this.distributionBase.libellumToken.call()).should.be.equal(this.libellumToken.address);
        });

        it('crowdsaleClosingTime is set correctly', async function () {
            (await this.distributionBase.crowdsaleClosingTime.call()).should.bignumber.be.equal(this.crowdsaleClosingTime);
        });

        it('isDistributed flag is false', async function () {
            (await this.distributionBase.isDistributed.call()).should.be.equal(false);
        });

        it('distribution is not possible since owner of the token is not distribution contract', async function () {
            await expectThrow(this.distributionBase.distribute());
        });

        describe("when ownership of token is transferred to distribution contract", function () {
            beforeEach(async function () {
                await this.libellumToken.transferOwnership(this.distributionBase.address);
            });

            describe("when distribution is triggered", function () {
                beforeEach(async function () {
                    await this.distributionBase.distribute();
                });
    
                it ('isDistributed flag set to true', async function () {
                    (await this.distributionBase.isDistributed.call()).should.be.equal(true);
                });
    
                it ('second call of distribute will be reverted', async function () {
                    await expectThrow(this.distributionBase.distribute());
                });
            });
        });
    });
});