const { LibellumTestValuesUsing, LibellumConstants } = artifacts.require("TestFactory.js");
const { increaseTimeTo, duration } = require('zeppelin-solidity/test/helpers/increaseTime');
const { expectThrow } = require('zeppelin-solidity/test/helpers/expectThrow.js');

const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-bignumber')(BigNumber))
    .should();

contract('LibellumTokenTimelock against LibellumCoin', function (accounts) {
    beforeEach(async function () {
        this.values = await LibellumTestValuesUsing(accounts);
        this.consts = await LibellumConstants();
    });

    it('cannot be released before time limit', async function () {
        await expectThrow(this.values.founderTimelockContract.releaseOn(this.values.libellumCoinContract.address));
    });

    it('cannot be released just before time limit', async function () {
        await increaseTimeTo(this.values.founderTimelockReleaseTime - duration.seconds(3));
        await expectThrow(this.values.founderTimelockContract.releaseOn(this.values.libellumCoinContract.address));
    });

    it('can be released just after limit', async function () {
        await increaseTimeTo(this.values.founderTimelockReleaseTime + duration.seconds(1));
        await this.values.founderTimelockContract.releaseOn(this.values.libellumCoinContract.address);
        const balance = await this.values.libellumCoinContract.balanceOf(this.values.founder);
        balance.should.be.bignumber.equal(this.consts.founderCoinsAfterRelease);
    });

    it('cannot be released twice', async function () {
        await increaseTimeTo(this.values.founderTimelockReleaseTime + duration.years(1));
        await this.values.founderTimelockContract.releaseOn(this.values.libellumCoinContract.address);
        await expectThrow(this.values.founderTimelockContract.releaseOn(this.values.libellumCoinContract.address));
        const balance = await this.values.libellumCoinContract.balanceOf(this.values.founder);
        balance.should.be.bignumber.equal(this.consts.founderCoinsAfterRelease);
    });
});