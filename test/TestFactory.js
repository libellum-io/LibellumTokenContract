var FounderTokenTimelock = artifacts.require("./Timelock/FounderTokenTimelock.sol");
var LibellumToken = artifacts.require("./LibellumToken.sol");
var LibellumCrowdsale = artifacts.require("./LibellumCrowdsale.sol");

async function LibellumTestValuesUsing (accounts) {
    this.owner = accounts[0];
    this.founder = accounts[1];
    this.beneficiary = accounts[2];
    this.fundsWallet = accounts[9];

    this.founderTimelockContract = await FounderTokenTimelock.new(this.founder);
    this.founderTimelockReleaseTime = await this.founderTimelockContract.releaseDate();

    this.libellumCrowdsaleContract = await LibellumCrowdsale.new(this.fundsWallet, {from: this.owner});

    const tokenAddress = await libellumCrowdsaleContract.token.call();
    this.libellumTokenContract = LibellumToken.at(tokenAddress);

    return this;
}

function UtcDateFrom (day, month, year) {
    return Math.round(new Date(Date.UTC(year, month-1, day, 0, 0, 0, 0)).getTime() / 1000);
}

LIB = (10 ** 18);
Mio = 1000000;

module.exports = {
    LibellumTestValuesUsing,
    UtcDateFrom,
    LIB,
    Mio
};