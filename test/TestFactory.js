var FounderTokenTimelock = artifacts.require("./Timelock/FounderTokenTimelock.sol");
var LibellumToken = artifacts.require("./LibellumToken.sol");
var LibellumCrowdsale = artifacts.require("./LibellumCrowdsale.sol");

async function LibellumTestValuesUsing (accounts) {
    this.owner = accounts[0];
    this.founder = accounts[1];
    this.fundsWallet = accounts[9];

    this.founderTimelockContract = await FounderTokenTimelock.new(this.founder);
    this.founderTimelockReleaseTime = await this.founderTimelockContract.releaseDate();

    this.libellumTokenContract = await LibellumToken.new(
        this.founder,
        this.founderTimelockContract.address,
        {from: this.owner}
    );

    this.libellumCrowdsaleContract = await LibellumCrowdsale.new(
        this.fundsWallet,
        this.libellumTokenContract.address,
        {from: this.owner}
    );

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