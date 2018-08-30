const { LibellumTestValuesUsing, LibellumConstants } = require("./TestFactory.js");
const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-bignumber')(BigNumber))
    .should();

contract('LibellumCoin', function (accounts) {
    var contract;
    beforeEach(async function () {
        this.values = await LibellumTestValuesUsing(accounts);
        this.consts = LibellumConstants();
    });

    describe('total supply', function () {
        it('returns the total amount of tokens', async function () {
            (await this.values.libellumCoinContract.totalSupply()).should.be.bignumber.equal(this.consts.totalCoins);
        });
    });

    describe('transfer', function () {
        describe('when the sender is owner and recepient is founder', function () {
            it('10 LIB moved from owner to founder', async function () {
                (await this.values.libellumCoinContract.transfer(this.values.founder, this.consts.LIB_10, {from: this.consts.owner}));
    
                (await this.values.libellumCoinContract.balanceOf(this.values.owner)).should.be.bignumber.equal(this.consts.ownerCoins - this.consts.LIB_10);
                (await this.values.libellumCoinContract.balanceOf(this.values.founder)).should.be.bignumber.equal(this.consts.founderCoins + this.consts.LIB_10);
            });
        });
    });

    describe('amount', function () {
        it('90Mio belongs to contract owner', async function () {
            (await this.values.libellumCoinContract.balanceOf(this.values.owner)).should.be.bignumber.equal(this.consts.ownerCoins);
        });
    });

    describe('amount', function () {
        it('5Mio belongs to founder', async function () {
            (await this.values.libellumCoinContract.balanceOf(this.values.founder)).should.be.bignumber.equal(this.consts.founderCoins);
        });
    });

    describe('amount', function () {
        it('5Mio belongs to founder TokenTimelock contract', async function () {
            (await this.values.libellumCoinContract.balanceOf(this.values.founderTimelockContract.address)).should.be.bignumber.equal(this.consts.founderTokenTimelockCoins);
        });
    });
});