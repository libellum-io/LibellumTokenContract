const { LibellumTestValuesUsing, LIB, Mio } = require("../TestFactory.js");
const { increaseTimeTo, duration } = require('../helpers/increaseTime');
const { expectThrow } = require('../helpers/expectThrow.js');

const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-bignumber')(BigNumber))
    .should();

contract('TokenTimelockBase (basic)', function (accounts) {
    beforeEach(async function () {
        this.values = await LibellumTestValuesUsing(accounts);
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
        balance.should.be.bignumber.equal(10 * Mio * LIB);
    });
});

contract('TokenTimelockBase (additional)', function (accounts) {
    beforeEach(async function () {
        this.values = await LibellumTestValuesUsing(accounts);
    });

    it('cannot be released twice', async function () {
        await increaseTimeTo(this.values.founderTimelockReleaseTime + duration.hours(1));
        await this.values.founderTimelockContract.releaseOn(this.values.libellumCoinContract.address);
        await expectThrow(this.values.founderTimelockContract.releaseOn(this.values.libellumCoinContract.address));
        const balance = await this.values.libellumCoinContract.balanceOf(this.values.founder);
        balance.should.be.bignumber.equal(10 * Mio * LIB);
    });
});