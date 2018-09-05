pragma solidity ^0.4.24;

import "./openzeppelin-solidity/contracts/crowdsale/Crowdsale.sol";
import "./openzeppelin-solidity/contracts/crowdsale/validation/WhitelistedCrowdsale.sol";
import "./openzeppelin-solidity/contracts/crowdsale/validation/IndividuallyCappedCrowdsale.sol";
import "./openzeppelin-solidity/contracts/crowdsale/validation/TimedCrowdsale.sol";
import "./openzeppelin-solidity/contracts/crowdsale/distribution/RefundableCrowdsale.sol";
import "./openzeppelin-solidity/contracts/crowdsale/distribution/PostDeliveryCrowdsale.sol";

import "./LibellumToken.sol";

contract LibellumCrowdsale is PostDeliveryCrowdsale, RefundableCrowdsale, IndividuallyCappedCrowdsale, WhitelistedCrowdsale {
    uint256 constant ETH = 10 ** 18;

    uint256 constant GOAL = 200 * ETH;
    
    uint256 constant START_TIME = 1538265600; // 30-Sep-18
    uint256 constant END_TIME = 1543536000; // 30-Nov-18 - end date is still not known
    uint256 constant BEGINNING_RATE = 2;

    constructor(address _wallet)
        RefundableCrowdsale(GOAL)
        TimedCrowdsale(START_TIME, END_TIME)
        Crowdsale(BEGINNING_RATE, _wallet, new LibellumToken())
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

    /**
    * @dev Method overriden to use mint function insted of transfer
    * @param _beneficiary Address performing the token purchase
    * @param _tokenAmount Number of tokens to be emitted
    */
    function _deliverTokens(
        address _beneficiary,
        uint256 _tokenAmount
    )
        internal
    {
        require(goalReached(), "Goal is not reached, can't mint tokens!");
        MintableToken(token).mint(_beneficiary, _tokenAmount);
    }
}