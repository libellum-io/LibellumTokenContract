const { LibellumTestValuesFrom } = require("../TestFactory.js");
const { expectThrow } = require('../helpers/expectThrow.js');
const { ether } = require('../helpers/ether.js');
const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-bignumber')(BigNumber))
    .should();

contract('IndividuallyCappedWhitelistedCrowdsale', function (accounts) {
    let goal = ether(20);
    let individualCap = ether(40);

    beforeEach(async function () {
        this.values = await LibellumTestValuesFrom(accounts, goal, individualCap);
        await this.values.increaseTimeToPhase1();
        this.beneficiary = this.values.unwhitelistedBeneficiary;
    });

    describe("buyTokens", function () {
        describe('when beneficiary is not whitelisted', function () {
            it('transaction is reverted and post delivery balance is still zero', async function () {
                await expectThrow(this.values.libellumCrowdsale.buyTokens(this.beneficiary, {value: ether(10), from: this.beneficiary}));
                (await this.values.libellumCrowdsale.balances.call(this.beneficiary)).should.be.bignumber.equal(0);
            });

            it('individual cap for beneficiary is zero', async function () {
                (await this.values.libellumCrowdsale.caps.call(this.beneficiary)).should.be.bignumber.equal(0);
            });
        });

        describe('when beneficiary is whitelisted', function () {
            beforeEach(async function () {
                await this.values.libellumCrowdsale.addAddressToWhitelist(this.beneficiary, {from: this.values.owner});
            });

            it('transaction pass and beneficiary post delivery balance is not zero', async function () {
                await this.values.libellumCrowdsale.buyTokens(this.beneficiary, {value: ether(10), from: this.beneficiary});
                (await this.values.libellumCrowdsale.balances.call(this.beneficiary)).should.not.bignumber.equal(0);
            });

            it('individual cap for beneficiary is set correctly', async function () {
                (await this.values.libellumCrowdsale.caps.call(this.beneficiary)).should.be.bignumber.equal(ether(40));
            });

            it('beneficiary is not able to pay more than cap', async function () {
                await expectThrow(this.values.libellumCrowdsale.buyTokens(this.beneficiary, {value: ether(50), from: this.beneficiary}));
                (await this.values.libellumCrowdsale.balances.call(this.beneficiary)).should.be.bignumber.equal(0);
            });
        });
    });

    describe("setting custom individual cap when beneficiaries are whitelisted", function () {
        beforeEach(async function () {
            await this.values.libellumCrowdsale.addAddressToWhitelist(this.beneficiary, {from: this.values.owner});
        });

        it("setting custom cap is not allowed", async function () {
            await expectThrow(this.values.libellumCrowdsale.setUserCap(this.beneficiary, ether(50), {from: this.values.owner}));
            (await this.values.libellumCrowdsale.caps.call(this.beneficiary)).should.be.bignumber.equal(ether(40));
        });

        it("setting custom group cap is not allowed", async function () {
            await expectThrow(this.values.libellumCrowdsale.setGroupCap([this.beneficiary, this.values.whitelistedBeneficiary], ether(50), {from: this.values.owner}));
            (await this.values.libellumCrowdsale.caps.call(this.beneficiary)).should.be.bignumber.equal(ether(40));
        });
    });
});