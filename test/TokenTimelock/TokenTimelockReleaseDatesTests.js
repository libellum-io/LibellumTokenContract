const { LibellumTestValuesUsing, UtcDateFrom } = require("../TestFactory.js");
const { duration } = require('zeppelin-solidity/test/helpers/increaseTime');
const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-bignumber')(BigNumber))
    .should();

contract('Token timelock release dates tests', function (accounts) {
    
    beforeEach(async function () {
        let values = await LibellumTestValuesUsing(accounts);
        this.founderTimelockContract = values.founderTimelockContract;
    });

    describe('for each locked member', function () {
        it('founder locktime is till 01-Sep-19', async function () {
            (await this.founderTimelockContract.releaseDate()).should.be.bignumber.equal(UtcDateFrom(1, 9, 2019));
        });
    });
});