const { LibellumTestValuesUsing, LIB } = require("./TestFactory.js");
const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-bignumber')(BigNumber))
    .should();

contract('LibellumCoin', function (accounts) {
    var contract;
    beforeEach(async function () {
        this.values = await LibellumTestValuesUsing(accounts);
    });

    describe('total supply', function () {
        it('should be 100Mio of LIB coins', async function () {
            (await this.values.libellumCoinContract.totalSupply()).should.be.bignumber.equal(100 * Mio * LIB);
        });
    });

    describe('amount', function () {
        it('90Mio belongs to contract owner', async function () {
            (await this.values.libellumCoinContract.balanceOf(this.values.owner)).should.be.bignumber.equal(90 * Mio * LIB);
        });
    });

    describe('amount', function () {
        it('5Mio belongs to founder', async function () {
            (await this.values.libellumCoinContract.balanceOf(this.values.founder)).should.be.bignumber.equal(5 * Mio * LIB);
        });
    });

    describe('amount', function () {
        it('5Mio belongs to founder TokenTimelock contract', async function () {
            (await this.values.libellumCoinContract.balanceOf(this.values.founderTimelockContract.address)).should.be.bignumber.equal(5 * Mio * LIB);
        });
    });
});