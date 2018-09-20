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

    describe('token distribution preparation validation', function () {
        it('if crowdsale closing time is zero transaction is reverted', async function () {
            await expectThrow(TokenDistributionBase.new(this.libellumToken.address, 0, {from: owner}));
        });

        it('if token address is zero transaction is reverted', async function () {
            await expectThrow(TokenDistributionBase.new(ZeroAddress, this.crowdsaleClosingTime, {from: owner}));
        });
    });

    describe('when contract is created', function () {
        beforeEach(async function () {
            this.distributionBase = await TokenDistributionBase.new(this.libellumToken.address, this.crowdsaleClosingTime, {from: owner});
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

        describe("when distribution is triggered", function () {
            beforeEach(async function () {
                await this.distributionBase.distribute();
            });

            it ('isDistributed flag is set to true', async function () {
                (await this.distributionBase.isDistributed.call()).should.be.equal(true);
            });

            it ('second call of distribute will be reverted', async function () {
                await expectThrow(this.distributionBase.distribute());
            });
        });
    });
});