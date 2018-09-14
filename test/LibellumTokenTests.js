var LibellumToken = artifacts.require("./LibellumToken.sol");
const { Mio, LIB } = require("./TestFactory.js");
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

        it('should have minting cap of 100 Mio LIB', async function () {
            (await this.libbelumToken.cap()).should.be.bignumber.equal(100 * Mio * LIB);
        });
    });
});