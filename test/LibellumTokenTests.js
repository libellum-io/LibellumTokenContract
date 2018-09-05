var LibellumToken = artifacts.require("./LibellumToken.sol");
const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-bignumber')(BigNumber))
    .should();

contract('LibellumToken', function (accounts) {
    let owner = accounts[0];     
    
    beforeEach(async function () {
        this.libbelumToken = await LibellumToken.new({from: owner});
    });

    describe('basic info', function () {
        it('should have 18 decimals', async function () {
            (await this.libbelumToken.decimals()).should.be.bignumber.equal(18);
        });

        it('should have name Libellum Token', async function () {
            (await this.libbelumToken.name()).should.be.equal("Libellum Token");
        });

        it('should have symbol LIB', async function () {
            (await this.libbelumToken.symbol()).should.be.equal("LIB");
        });
    });
});