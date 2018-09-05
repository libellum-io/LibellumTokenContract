pragma solidity ^0.4.24;

import "./openzeppelin-solidity/contracts/crowdsale/Crowdsale.sol";
import "./openzeppelin-solidity/contracts/crowdsale/emission/MintedCrowdsale.sol";
import "./openzeppelin-solidity/contracts/crowdsale/validation/WhitelistedCrowdsale.sol";
import "./openzeppelin-solidity/contracts/crowdsale/validation/IndividuallyCappedCrowdsale.sol";
import "./openzeppelin-solidity/contracts/crowdsale/validation/TimedCrowdsale.sol";
import "./openzeppelin-solidity/contracts/crowdsale/distribution/RefundableCrowdsale.sol";
import "./openzeppelin-solidity/contracts/crowdsale/distribution/PostDeliveryCrowdsale.sol";

import "./LibellumToken.sol";

contract LibellumCrowdsale is PostDeliveryCrowdsale, RefundableCrowdsale, IndividuallyCappedCrowdsale, WhitelistedCrowdsale, MintedCrowdsale {
    uint256 constant ETH = 10 ** 18;

    uint256 minEthChangeDate;
    
    constructor(
        uint256 _goal,
        uint256 _startDate,
        uint256 _minEthChangeDate,
        uint256 _endDate,
        LibellumToken _wallet)
        RefundableCrowdsale(_goal)
        TimedCrowdsale(_startDate, _endDate)
        Crowdsale(1, _wallet, new LibellumToken())
    public
    {
        require(_startDate < _minEthChangeDate, "Minimum ETH allowed to pay change date can't be before crowdsale start date");
        require(_endDate > _minEthChangeDate, "Minimum ETH allowed to pay change date can't be after crowdsale end date");
        minEthChangeDate = _minEthChangeDate;
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
        super._deliverTokens(_beneficiary, _tokenAmount);
    }
}