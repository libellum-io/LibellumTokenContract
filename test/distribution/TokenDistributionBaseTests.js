var LibellumToken = artifacts.require("./LibellumToken.sol");
var DistributionBase = artifacts.require("./distribution/DistributionBase.sol");

const { ZeroAddress } = require("../TestFactory.js");
const { latestTime } = require('../helpers/latestTime');
const { duration } = require('../helpers/increaseTime');
const { expectThrow } = require('../helpers/expectThrow.js');
const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-bignumber')(BigNumber))
    .should();

contract('LockedTokenDistribution', function (accounts) {
    let owner = accounts[0];

    beforeEach(async function () {
        this.distributionBase = await DistributionBase.new({from: owner});
    });

    describe('when distribution is not triggered', function () {
        it('token address is zero', async function () {
            (await this.distributionBase.token.call()).should.be.equal(ZeroAddress);
        });

        it('crowdsaleClosingTime is zero', async function () {
            (await this.distributionBase.crowdsaleClosingTime.call()).should.bignumber.be.equal(0);
        });

        it('isDistributed flag is false', async function () {
            (await this.distributionBase.isDistributed.call()).should.be.equal(false);
        });
    });

    describe('distribution validation', function () {
        it('distribution passes if all parameters are valid', async function () {
            this.libellumToken = await LibellumToken.new({from: owner});
            this.libellumToken.transferOwnership(this.distributionBase.address, {from: owner});
            await this.distributionBase.distribute(this.libellumToken.address, await latestTime());
        });

        it('if crowdsaleClosingtime is from the past transaction is reverted', async function () {
            this.libellumToken = await LibellumToken.new({from: owner});
            this.libellumToken.transferOwnership(this.distributionBase.address, {from: owner});
            await expectThrow(this.distributionBase.distribute(this.libellumToken.address, await latestTime() - duration.seconds(10)));
        });

        it('if token address is zero transaction is reverted', async function () {
            await expectThrow(this.distributionBase.distribute(ZeroAddress, await latestTime()));
        });

        it('if token is not owned by the contract transaction is reverted', async function () {
            this.libellumToken = await LibellumToken.new({from: owner});
            await expectThrow(this.distributionBase.distribute(this.libellumToken.address, await latestTime()));
        });

        it('if distribution is triggered for second time transaction is reverted', async function () {
            this.libellumToken = await LibellumToken.new({from: owner});
            this.libellumToken.transferOwnership(this.distributionBase.address, {from: owner});
            await this.distributionBase.distribute(this.libellumToken.address, await latestTime());
            await expectThrow(this.distributionBase.distribute(this.libellumToken.address, await latestTime()));
        });
    });

    describe('when distribution is triggered', function () {
        beforeEach(async function () {
            this.libellumToken = await LibellumToken.new({from: owner});
            this.libellumToken.transferOwnership(this.distributionBase.address, {from: owner});
            this.crowdsaleClosingTime = await latestTime();
            await this.distributionBase.distribute(this.libellumToken.address, this.crowdsaleClosingTime);
        });

        it('token address is set correctly', async function () {
            (await this.distributionBase.token.call()).should.be.equal(this.libellumToken.address);
        });

        it('crowdsaleClosingTime is set correctly', async function () {
            (await this.distributionBase.crowdsaleClosingTime.call()).should.bignumber.be.equal(this.crowdsaleClosingTime);
        });

        it('isDistributed flag is true', async function () {
            (await this.distributionBase.isDistributed.call()).should.be.equal(true);
        });
    });
});