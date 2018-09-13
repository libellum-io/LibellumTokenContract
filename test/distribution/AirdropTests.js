const { expectThrow } = require('../helpers/expectThrow.js');
const BigNumber = web3.BigNumber;
var LibellumToken = artifacts.require("./LibellumToken.sol");
var Airdrop = artifacts.require("./distribution/Airdrop.sol");

require('chai')
  .use(require('chai-bignumber')(BigNumber))
    .should();

contract('Airdrop.doAirdrop()', function (accounts) {
    let owner = accounts[0];
    let recepients = [accounts[1], accounts[2], accounts[3], accounts[4]];

    beforeEach(async function () {
        this.token = await LibellumToken.new({from: owner});
        this.contract = await Airdrop.new(this.token.address, {from: owner});
    });

    describe('when contract has exact amount of tokens like sum of recepients balances', function () {
        beforeEach(async function () {
            this.contractBalance = 100;
            this.balances = [10, 20, 30, 40];
            await this.token.mint(this.contract.address, this.contractBalance, {from: owner});

            await this.contract.doAirdrop(recepients, this.balances, {from: owner});
        });

        it ('contract balance should be empty', async function () {
            (await this.token.balanceOf(this.contract.address)).should.be.bignumber.equal(0);
        });

        it ('recepients should have correct balances', async function () {
            (await this.token.balanceOf(recepients[0])).should.be.bignumber.equal(this.balances[0]);
            (await this.token.balanceOf(recepients[1])).should.be.bignumber.equal(this.balances[1]);
            (await this.token.balanceOf(recepients[2])).should.be.bignumber.equal(this.balances[2]);
            (await this.token.balanceOf(recepients[3])).should.be.bignumber.equal(this.balances[3]);
        });
    });

    describe('when contract has more amount of tokens than sum of recipient balances', function () {
        beforeEach(async function () {
            this.contractBalance = 120;
            this.balances = [10, 20, 30, 40];
            await this.token.mint(this.contract.address, this.contractBalance, {from: owner});

            await this.contract.doAirdrop(recepients, this.balances, {from: owner});
        });

        it ('contract balance should be 20', async function () {
            (await this.token.balanceOf(this.contract.address)).should.be.bignumber.equal(20);
        });
    });

    describe('when contract has less amount of tokens than sum of recepients balances', function () {
        beforeEach(async function () {
            this.contractBalance = 80;
            this.balances = [10, 20, 30, 40];
            await this.token.mint(this.contract.address, this.contractBalance, {from: owner});

            await expectThrow(this.contract.doAirdrop(recepients, this.balances, {from: owner}));
        });

        it ('contract balance remains 80', async function () {
            (await this.token.balanceOf(this.contract.address)).should.be.bignumber.equal(80);
        });

        it ('recepients balances remain 0', async function () {
            (await this.token.balanceOf(recepients[0])).should.be.bignumber.equal(0);
            (await this.token.balanceOf(recepients[1])).should.be.bignumber.equal(0);
            (await this.token.balanceOf(recepients[2])).should.be.bignumber.equal(0);
            (await this.token.balanceOf(recepients[3])).should.be.bignumber.equal(0);
        });
    });

    describe('when parameters are bad', function () {
        beforeEach(async function () {
            this.contractBalance = 100;
            await this.token.mint(this.contract.address, this.contractBalance, {from: owner});
        });

        describe('when recepients array has not the same size as balances array', function () {
            it ('transaction should be reverted', async function () {
                let b = [10, 10, 10];
                await expectThrow(this.contract.doAirdrop(recepients, b, {from: owner}));
            });
        });

        describe('when balances array contains 0 value', function () {
            it ('transaction should be reverted', async function () {
                let b = [10, 10, 0, 10];
                await expectThrow(this.contract.doAirdrop(recepients, b, {from: owner}));
            });
        });
    });
});