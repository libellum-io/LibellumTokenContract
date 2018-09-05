var TokenTimelockBase = artifacts.require("./TokenTimelockBase.sol");
var MyToken = artifacts.require("./mocks/MyToken.sol");
const { latestTime } = require('./helpers/latestTime');
const { increaseTimeTo, duration } = require('./helpers/increaseTime');
const { expectThrow } = require('./helpers/expectThrow');

const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-bignumber')(BigNumber))
    .should();

contract('TokenTimelockBase', function (accounts) {
    let owner = accounts[0];
    let unit = 10 ** 18;

    beforeEach(async function () {
        let currentTime = await latestTime();
        let releaseDate = currentTime + duration.days(10);

        this.increaseTimeJustBeforeTheLimit = async function () { await increaseTimeTo(releaseDate - duration.seconds(3))}
        this.increaseTimeAfterTheLimit = async function () { await increaseTimeTo(releaseDate + duration.seconds(1))}

        this.tokenTimelock = await TokenTimelockBase.new(owner, releaseDate, {from: owner});
        this.token = await MyToken.new(this.tokenTimelock.address, {from: owner})
    });

    it('cannot be released before time limit', async function () {
        await expectThrow(this.tokenTimelock.releaseOn(this.token.address));
    });

    it('cannot be released just before time limit', async function () {
        await this.increaseTimeJustBeforeTheLimit();
        await expectThrow(this.tokenTimelock.releaseOn(this.token.address));
    });

    it('can be released just after limit', async function () {
        await this.increaseTimeAfterTheLimit();
        await this.tokenTimelock.releaseOn(this.token.address);
        const balance = await this.token.balanceOf(owner);
        balance.should.be.bignumber.equal(100 * unit);
    });

    it('cannot be released twice', async function () {
        await this.increaseTimeAfterTheLimit();
        await this.tokenTimelock.releaseOn(this.token.address);
        await expectThrow(this.tokenTimelock.releaseOn(this.token.address));
        const balance = await this.token.balanceOf(owner);
        balance.should.be.bignumber.equal(100 * unit);
    });
});