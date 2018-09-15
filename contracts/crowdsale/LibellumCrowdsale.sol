pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/crowdsale/Crowdsale.sol";
import "openzeppelin-solidity/contracts/crowdsale/emission/MintedCrowdsale.sol";

import "../LibellumToken.sol";
import "../distribution/LibellumTokenDistribution.sol";
import "./IndividuallyCappedWhitelistedCrowdsale.sol";
import "./PostDeliveryRefundableCrowdsale.sol";
import "./ThreePhaseTimedCrowdsale.sol";

/**
* @dev Crowdsale contract that incorporates behaviors of different zeppelin's crowdsales: post token delivery,
* refundable crowdsale, whitelist and individual cap. Moreover, it uses ThreePhaseTimedCrowdsale to split crowdsale
* into three phases, where each phase defines different rate and different minimal amount of WEI investor can invest.
*/
contract LibellumCrowdsale is
    PostDeliveryRefundableCrowdsale,
    IndividuallyCappedWhitelistedCrowdsale,
    ThreePhaseTimedCrowdsale,
    MintedCrowdsale {

    LibellumTokenDistribution libellumTokenDistribution;

    uint256 constant INVESTMENT_TOKEN_POOL = 50000000000000000000000000; // 50 Mio LIB
    uint256 currentlyMintedInvestmentTokens;
    
    /**
    * @param _goal Goal of crowdsale campaign represented in WEI.
    * @param _individualCap Individual cap for each investor represented in WEI.
    * @param _openingTime Crowdsale start date.
    * @param _phase1ToPhase2Date Transition date between crowdsale's phase 1 and phase 2.
    * @param _phase2ToPhase3Date Transition date between crowdsale's phase 2 and phase 3.
    * @param _closingTime Crowdsale end date.
    * @param _wallet Destination wallet for all invested WEIs. (only in case when crowdsale is ended and if goal is reached)
    * @param _libellumTokenDistribution Distribution contract that is triggered by this contract on finalization (only if goal is reached).
    */
    constructor(
        uint256 _goal,
        uint256 _individualCap,
        uint256 _openingTime,
        uint256 _phase1ToPhase2Date,
        uint256 _phase2ToPhase3Date,
        uint256 _closingTime,
        address _wallet,
        LibellumTokenDistribution _libellumTokenDistribution)
        PostDeliveryRefundableCrowdsale(_goal)
        ThreePhaseTimedCrowdsale(_openingTime, _phase1ToPhase2Date, _phase2ToPhase3Date, _closingTime)
        IndividuallyCappedWhitelistedCrowdsale(_individualCap)
        Crowdsale(1, _wallet, new LibellumToken())
    public
    {
        require(_libellumTokenDistribution != address(0), "Libellum token distribution can't have 0 address");
        libellumTokenDistribution = _libellumTokenDistribution;
    }

    /**
    * @dev Appending validation to check if investment pool is still available for new purchases.
    * If not, transaction will be reverted.
    */
    function _processPurchase(address _beneficiary, uint256 _tokenAmount)
    internal
    {
        currentlyMintedInvestmentTokens = currentlyMintedInvestmentTokens.add(_tokenAmount);
        require(currentlyMintedInvestmentTokens <= INVESTMENT_TOKEN_POOL, "LIB pool reserved for investments is burned");
        super._processPurchase(_beneficiary, _tokenAmount);
    }

    /**
    * @dev As the last step of finalization is to trigger distribution of tokens only if goal is reached.
    */
    function finalization() 
    internal
    {
        super.finalization();

        if (goalReached())
        {
            distributeTokens();
        }
    }

    /**
    * @dev Before token distribution is triggered make sure to transfer the ownership
    * of token to the distribution contract. Only in that case contract will be able to
    * to distribute (mint) new tokens.
    */
    function distributeTokens()
    internal
    {
        LibellumToken libellumToken = LibellumToken(token);
        libellumToken.transferOwnership(address(libellumTokenDistribution));
        libellumTokenDistribution.distribute(libellumToken, closingTime);
    }
}