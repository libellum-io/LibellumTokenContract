var LibellumCoin = artifacts.require("./LibellumCoin.sol");
var LibellumTokenTimelock = artifacts.require("./LibellumTokenTimelock.sol");

const { latestTime } = require('zeppelin-solidity/test/helpers/latestTime');
const { duration } = require('zeppelin-solidity/test/helpers/increaseTime');

async function LibellumTestValuesUsing (accounts) {
    this.owner = accounts[0];
    this.founder = accounts[1];

    this.founderTimelockReleaseTime = (await latestTime()) + duration.years(1);
    this.founderTimelockContract = await LibellumTokenTimelock.new(this.beneficiary, this.founderTimelockReleaseTime);

    this.libellumCoinContract = await LibellumCoin.new(
        this.founder,
        this.founderTimelockContract.address,
        {from: this.owner}
    );
}

function LibellumConstants() {
    this.LIB = (10 ** 18);
    this._10_LIBs = 10 * LIB;

    this.totalCoins = 100000000 * LIB;

    this.founderCoins = 5000000 * LIB;
    this.founderCoinsAfterRelease = 10000000 * LIB;

    this.ownerCoins = 90000000 * LIB;
}

module.exports = {
    LibellumTestValuesUsing,
    LibellumConstants
};