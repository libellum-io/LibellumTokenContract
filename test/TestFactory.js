var LibellumCoin = artifacts.require("./LibellumCoin.sol");
var FounderTokenTimelock = artifacts.require("./Timelock/FounderTokenTimelock.sol");

async function LibellumTestValuesUsing (accounts) {
    this.owner = accounts[0];
    this.founder = accounts[1];

    this.founderTimelockContract = await FounderTokenTimelock.new(this.founder);
    this.founderTimelockReleaseTime = await this.founderTimelockContract.releaseDate();

    this.libellumCoinContract = await LibellumCoin.new(
        this.founder,
        this.founderTimelockContract.address,
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