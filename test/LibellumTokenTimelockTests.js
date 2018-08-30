var LibellumCoin = artifacts.require("./LibellumCoin.sol");
var LibellumTokenTimelock = artifacts.require("./LibellumTokenTimelock.sol");

const { latestTime } = require('zeppelin-solidity/test/helpers/latestTime');
const { increaseTimeTo, duration } = require('zeppelin-solidity/test/helpers/increaseTime');
const { expectThrow } = require('zeppelin-solidity/test/helpers/expectThrow.js');

const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-bignumber')(BigNumber))
    .should();

contract('LibellumTokenTimelock against LibellumCoin', function (accounts) {
    const amount = new BigNumber(100);

    beforeEach(async function () {
        this.owner = accounts[0];
        this.beneficiary = accounts[1];
        this.releaseTime = (await latestTime()) + duration.years(1);

        this.timelock = await LibellumTokenTimelock.new(this.beneficiary, this.releaseTime);
        this.token = await LibellumCoin.new({from: this.owner});

        await this.token.transfer(this.timelock.address, amount, { from: this.owner });
    });

    it('cannot be released before time limit', async function () {
        await expectThrow(this.timelock.releaseOn(this.token.address));
    });

    it('cannot be released just before time limit', async function () {
        await increaseTimeTo(this.releaseTime - duration.seconds(3));
        await expectThrow(this.timelock.releaseOn(this.token.address));
    });

    it('can be released just after limit', async function () {
        await increaseTimeTo(this.releaseTime + duration.seconds(1));
        await this.timelock.releaseOn(this.token.address);
        const balance = await this.token.balanceOf(this.beneficiary, {from: this.owner});
        balance.should.be.bignumber.equal(amount);
    });

    it('cannot be released twice', async function () {
        await increaseTimeTo(this.releaseTime + duration.years(1));
        await this.timelock.releaseOn(this.token.address);
        await expectThrow(this.timelock.releaseOn(this.token.address));
        const balance = await this.token.balanceOf(this.beneficiary);
        balance.should.be.bignumber.equal(amount);
    });
});