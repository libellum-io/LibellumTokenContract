const { LibellumTestValuesFrom, LIB, InitPhase1Rate, InitPhase2Rate, InitPhase3Rate } = require("../../TestFactory.js");
const { ether } = require('../../helpers/ether.js');
const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-bignumber')(BigNumber))
    .should();

contract('RateChangingTests', function (accounts) {
    let goal = ether(20);
    let individualCap = ether(40);

    beforeEach(async function () {
        this.values = await LibellumTestValuesFrom(accounts, goal, individualCap);
    });

    describe('during entire crowdsale', function () {
        it('Phase 1, 2 and 3 minimum WEI amounts are set', async function () {
            (await this.values.libellumCrowdsale.minWeisByPhase.call(1)).should.be.bignumber.equal(ether(5));
            (await this.values.libellumCrowdsale.minWeisByPhase.call(2)).should.be.bignumber.equal(ether(0.1));
            (await this.values.libellumCrowdsale.minWeisByPhase.call(3)).should.be.bignumber.equal(ether(0.1));
        });
    });
});