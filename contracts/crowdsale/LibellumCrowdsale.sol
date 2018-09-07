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

    uint256 constant INVESTMENT_TOKEN_POOL = 60000000000000000000000000; // 60 Mio LIB

    uint256 currentlyMintedInvestmentTokens;
    
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

    /**
    * @dev Appending validation for checking if investment pool is still available for new purchases.
    * If not, transaction will be reverted.
    */
    function _processPurchase(address _beneficiary, uint256 _tokenAmount)
    internal
    {
        require(currentlyMintedInvestmentTokens.add(_tokenAmount) <= INVESTMENT_TOKEN_POOL, "LIB pool reserved for investments is burned");
        super._processPurchase(_beneficiary, _tokenAmount);
        currentlyMintedInvestmentTokens = currentlyMintedInvestmentTokens.add(_tokenAmount);
    }
}