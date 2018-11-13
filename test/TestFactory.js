var LibellumToken = artifacts.require("./LibellumToken.sol");
var LibellumCrowdsale = artifacts.require("./crowdsale/LibellumCrowdsale.sol");
var LibellumTokenDistribution = artifacts.require("./distribution/LibellumTokenDistribution.sol");

const { latestTime } = require('./helpers/latestTime');
const { increaseTimeTo, duration } = require('./helpers/increaseTime');
const { ether } = require('./helpers/ether.js');

async function LibellumTestValuesFrom(accounts, goal, defaultIndividualCap) {
    let currentTime = await latestTime();
    let values = await LibellumTestValuesFromInternal(
        accounts,
        goal,
        defaultIndividualCap,
        currentTime + duration.days(10),
        currentTime + duration.days(20),
        currentTime + duration.days(30),
        currentTime + duration.days(40));

    values.increaseTimeToPhase1 = async function () { await increaseTimeTo(currentTime + duration.days(15)); }
    values.increaseTimeToPhase2 = async function () { await increaseTimeTo(currentTime + duration.days(25)); }
    values.increaseTimeToPhase3 = async function () { await increaseTimeTo(currentTime + duration.days(35)); }
    values.increaseTimeToAfterTheEnd = async function () { await increaseTimeTo(currentTime + duration.days(45)); }
    values.increaseTimeSixMonthsAfterTheEnd = async function () { await increaseTimeTo(currentTime + duration.days(45) + ((duration.years(1) + duration.days(1)) / 2)); }
    values.increaseTimeOneYearAfterTheEnd = async function () { await increaseTimeTo(currentTime + duration.days(45) + duration.years(1)); }

    return values;
}

async function LibellumTestValuesFromInternal (
    accounts,
    goal,
    defaultIndividualCap,
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
    this.airdropRecipient = accounts[7];
    this.bountyPool = accounts[8];
    this.rAndDPool = accounts[9];
    this.teamReserveFund = accounts[10];
    this.fundsWallet = accounts[11];

    let distributionAddresses = [this.founder1, this.founder2, this.advisor1, this.advisor2, this.bountyPool, this.rAndDPool, this.teamReserveFund];

    this.libellumCrowdsale = await LibellumCrowdsale.new(
        goal,
        defaultIndividualCap,
        startDate,
        phase1ToPhase2Date,
        phase2ToPhase3Date,
        endDate,
        this.fundsWallet,
        distributionAddresses,
        {from: this.owner});

    this.libellumTokenDistribution = LibellumTokenDistribution.at(await this.libellumCrowdsale.libellumTokenDistribution.call());

    await this.libellumCrowdsale.addAddressToWhitelist(this.whitelistedBeneficiary, {from: this.owner});

    const tokenAddress = await this.libellumCrowdsale.token.call();
    this.libellumToken = LibellumToken.at(tokenAddress);

    return this;
}

function UtcDateFrom (day, month, year) {
    return Math.round(new Date(Date.UTC(year, month-1, day, 0, 0, 0, 0)).getTime() / 1000);
}

LIB = (10 ** 18);
Mio = 1000000;
ZeroAddress = '0x0000000000000000000000000000000000000000';

InitPhase1Rate = 4199;
InitPhase2Rate = 2624;
InitPhase3Rate = 2099;

module.exports = {
    LibellumTestValuesFrom,
    UtcDateFrom,
    LIB,
    Mio,
    ZeroAddress,
    InitPhase1Rate,
    InitPhase2Rate,
    InitPhase3Rate
};