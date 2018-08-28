var LibellumCoin = artifacts.require("./LibellumCoin.sol");
const BigNumber = web3.BigNumber;

const TOTAL_SUPPLY = 100000000 * (10 ** 18);

require('chai')
  .use(require('chai-bignumber')(BigNumber))
    .should();

contract('LibellumCoin', function (accounts) {
    var contract;
    beforeEach(async function () {
        this.token = await LibellumCoin.new();
    });

    describe('total supply', function () {
        it('returns the total amount of tokens', async function () {
            (await this.token.totalSupply()).should.be.bignumber.equal(TOTAL_SUPPLY);
        });
    });

    describe('transfer', function () {
        describe('when the recepient is valid address', function () {
            it('10 LIB moved from sender to recepient', async function () {
                let amountToTransfer = 10 * (10 ** 18);
                (await this.token.transfer(accounts[1], amountToTransfer, {from: accounts[0]}));
    
                (await this.token.balanceOf(accounts[0])).should.be.bignumber.equal(TOTAL_SUPPLY - amountToTransfer);
                (await this.token.balanceOf(accounts[1])).should.be.bignumber.equal(amountToTransfer);
            });
        });
    });
});