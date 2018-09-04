const { LibellumTestValuesUsing, LIB } = require("./TestFactory.js");
const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-bignumber')(BigNumber))
    .should();

contract('LibellumToken', function (accounts) {
    var contract;
    beforeEach(async function () {
        this.values = await LibellumTestValuesUsing(accounts);
    });

    describe('total supply', function () {
        it('should be 100Mio of LIB tokens', async function () {
            (await this.values.libellumTokenContract.totalSupply()).should.be.bignumber.equal(100 * Mio * LIB);
        });
    });

    describe('amount per address', function () {
        it('90Mio belongs to contract owner', async function () {
            (await this.values.libellumTokenContract.balanceOf(this.values.owner)).should.be.bignumber.equal(90 * Mio * LIB);
        });

        it('5Mio belongs to founder', async function () {
            (await this.values.libellumTokenContract.balanceOf(this.values.founder)).should.be.bignumber.equal(5 * Mio * LIB);
        });

        it('5Mio belongs to founder TokenTimelock contract', async function () {
            (await this.values.libellumTokenContract.balanceOf(this.values.founderTimelockContract.address)).should.be.bignumber.equal(5 * Mio * LIB);
        });
    });
});