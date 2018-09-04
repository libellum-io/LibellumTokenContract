pragma solidity ^0.4.24;

import "zeppelin-solidity/contracts/crowdsale/Crowdsale.sol";
import "zeppelin-solidity/contracts/crowdsale/validation/WhitelistedCrowdsale.sol";
import "zeppelin-solidity/contracts/crowdsale/validation/IndividuallyCappedCrowdsale.sol";
import "zeppelin-solidity/contracts/crowdsale/validation/TimedCrowdsale.sol";
import "zeppelin-solidity/contracts/crowdsale/distribution/RefundableCrowdsale.sol";
import "zeppelin-solidity/contracts/crowdsale/distribution/PostDeliveryCrowdsale.sol";

import "./LibellumToken.sol";

contract LibellumCrowdsale is PostDeliveryCrowdsale, RefundableCrowdsale, IndividuallyCappedCrowdsale, WhitelistedCrowdsale {
    uint256 constant ETH = 10 ** 18;

    uint256 constant GOAL = 2 * ETH;
    
    uint256 constant START_TIME = 1538265600; // 30-Sep-18
    uint256 constant END_TIME = 1543536000; // 30-Nov-18 - end date is still not known
    uint256 constant BEGINNING_RATE = 2;

    constructor(address _wallet, LibellumToken _token)
        RefundableCrowdsale(GOAL)
        TimedCrowdsale(START_TIME, END_TIME)
        Crowdsale(BEGINNING_RATE, _wallet, _token)
    public
    {
    }

    /**
    * @dev Whitelists a beneficiary with his maximum contribution.
    * @param _beneficiary Address to be whitelisted
    * @param _cap Wei limit for individual contribution
    */
    function addToWhitelist(address _beneficiary, uint256 _cap) external onlyOwner {
        addAddressToWhitelist(_beneficiary);
        caps[_beneficiary] = _cap;
    }
}