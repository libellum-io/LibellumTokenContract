pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/crowdsale/Crowdsale.sol";
import "openzeppelin-solidity/contracts/crowdsale/emission/MintedCrowdsale.sol";

import "../LibellumToken.sol";
import "./IndividuallyCappedWhitelistedCrowdsale.sol";
import "./PostDeliveryRefundableCrowdsale.sol";
import "./ThreePhaseTimedCrowdsale.sol";

contract LibellumCrowdsale is
    PostDeliveryRefundableCrowdsale,
    ThreePhaseTimedCrowdsale,
    IndividuallyCappedWhitelistedCrowdsale,
    MintedCrowdsale {
    
    constructor(
        uint256 _goal,
        uint256 _individualCap,
        uint256 _startDate,
        uint256 _phase1ToPhase2Date,
        uint256 _phase2ToPhase3Date,
        uint256 _endDate,
        address _wallet)
        PostDeliveryRefundableCrowdsale(_goal)
        ThreePhaseTimedCrowdsale(_startDate, _phase1ToPhase2Date, _phase2ToPhase3Date, _endDate)
        IndividuallyCappedWhitelistedCrowdsale(_individualCap)
        Crowdsale(1, _wallet, new LibellumToken())
    public
    {
    }
}