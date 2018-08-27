var LibellumCoin = artifacts.require("./LibellumCoin.sol");

contract('LibellumCoin', function (accounts) {
    var contract;
    beforeEach(function () {
        return LibellumCoin.new()
            .then(function(instance) {
                contract = instance;
            });
    });

    it("test ERC20 totalSupply()", function () {
        return LibellumCoin.deployed().then(function (instance) {
            return contract.totalSupply.call({from: accounts[0]});
        }).then(function (totalSupply) {
            assert.equal(totalSupply.valueOf(), 100000000 * (10 ** 18), "total supply should be 100Mio");
        });
    });
});