var LibellumCoin = artifacts.require("./LibellumCoin.sol");
var LibellumTokenTimelock = artifacts.require("./LibellumTokenTimelock.sol");

const { latestTime } = require('zeppelin-solidity/test/helpers/latestTime');
const { duration } = require('zeppelin-solidity/test/helpers/increaseTime');

async function LibellumTestValuesUsing (accounts) {
    this.owner = accounts[0];
    this.founder = accounts[1];

    this.founderTimelockReleaseTime = (await latestTime()) + duration.years(1);
    this.founderTimelockContract = await LibellumTokenTimelock.new(this.founder, this.founderTimelockReleaseTime);

    this.libellumCoinContract = await LibellumCoin.new(
        this.founder,
        this.founderTimelockContract.address,
        {from: this.owner}
    );

    return this;
}

function LibellumConstants() {
    this.LIB = (10 ** 18);
    this.LIB_10 = 10 * LIB;

    this.totalCoins = 100000000 * LIB;

    this.founderCoins = 5000000 * LIB;
    this.founderTokenTimelockCoins = 5000000 * LIB;
    this.founderCoinsAfterRelease = founderCoins + founderTokenTimelockCoins;

    this.ownerCoins = 90000000 * LIB;

    return this;
}

module.exports = {
    LibellumTestValuesUsing,
    LibellumConstants
};