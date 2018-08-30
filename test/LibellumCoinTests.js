const { LibellumTestValuesUsing, LibellumConstants } = artifacts.require("TestFactory.js");
const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-bignumber')(BigNumber))
    .should();

contract('LibellumCoin', function (accounts) {
    var contract;
    beforeEach(async function () {
        this.values = await LibellumTestValuesUsing(accounts);
        this.consts = await LibellumConstants();
    });

    describe('total supply', function () {
        it('returns the total amount of tokens', async function () {
            (await this.values.libellumCoinContract.totalSupply()).should.be.bignumber.equal(this.consts.totalCoins);
        });
    });

    describe('transfer', function () {
        describe('when the sender is owner and recepient is founder', function () {
            it('10 LIB moved from owner to founder', async function () {
                (await this.token.transfer(this.values.founder, this.consts._10_LIBs, {from: this.consts.owner}));
    
                (await this.token.balanceOf(this.values.owner)).should.be.bignumber.equal(this.consts.ownerCoins - this.const._10_LIBs);
                (await this.token.balanceOf(this.values.founder)).should.be.bignumber.equal(this.consts.founderCoins + this.const._10_LIBs);
            });
        });
    });
});