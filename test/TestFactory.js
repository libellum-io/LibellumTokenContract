var LibellumToken = artifacts.require("./LibellumToken.sol");
var LibellumCrowdsale = artifacts.require("./crowdsale/LibellumCrowdsale.sol");

const { latestTime } = require('./helpers/latestTime');
const { increaseTimeTo, duration } = require('./helpers/increaseTime');
const { ether } = require('./helpers/ether.js');

async function LibellumCrowdsaleValuesFrom(accounts, goal, individualCap) {
    let currentTime = await latestTime();
    let values = await LibellumCrowdsaleValuesFromInternal(
        accounts,
        goal,
        individualCap,
        currentTime + duration.days(10),
        currentTime + duration.days(20),
        currentTime + duration.days(30),
        currentTime + duration.days(40));

    values.increaseTimeToPhase1 = async function () { await increaseTimeTo(currentTime + duration.days(15)); }
    values.increaseTimeToPhase2 = async function () { await increaseTimeTo(currentTime + duration.days(25)); }
    values.increaseTimeToPhase3 = async function () { await increaseTimeTo(currentTime + duration.days(35)); }
    values.increaseTimeToAfterTheEnd = async function () { await increaseTimeTo(currentTime + duration.days(45)); }

    return values;
}

async function LibellumCrowdsaleValuesFromInternal (
    accounts,
    goal,
    individualCap,
    startDate,
    phase1ToPhase2Date,
    phase2ToPhase3Date,
    endDate) {
    this.owner = accounts[0];
    this.founder1 = accounts[1];
    this.founder2 = accounts[2];
    this.advisor1 = accounts[3];
    this.advisor2 = accounts[4];
    this.whitelistedBeneficiary = accounts[5];
    this.whitelistedBeneficiaryCap = ether(20);
    this.unwhitelistedBeneficiary = accounts[6];
    this.fundsWallet = accounts[9];

    this.libellumCrowdsale = await LibellumCrowdsale.new(
        goal,
        individualCap,
        startDate,
        phase1ToPhase2Date,
        phase2ToPhase3Date,
        endDate,
        this.fundsWallet,
        {from: this.owner});

    await this.libellumCrowdsale.addAddressToWhitelist(this.whitelistedBeneficiary, {from: this.owner});

    const tokenAddress = await libellumCrowdsale.token.call();
    this.libellumToken = LibellumToken.at(tokenAddress);

    return this;
}

function UtcDateFrom (day, month, year) {
    return Math.round(new Date(Date.UTC(year, month-1, day, 0, 0, 0, 0)).getTime() / 1000);
}

LIB = (10 ** 18);
Mio = 1000000;

module.exports = {
    LibellumCrowdsaleValuesFrom,
    UtcDateFrom,
    LIB,
    Mio
};