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

    LibellumTokenDistribution public libellumTokenDistribution;

    uint256 constant INVESTMENT_TOKEN_POOL = 50000000000000000000000000; // 50 Mio LIB
    uint256 currentlyMintedInvestmentTokens;
    
    /**
    * @param _goal Goal of crowdsale campaign represented in WEI.
    * @param _defaultIndividualCap Default individual cap for each investor represented in WEI.
    * @param _openingTime Crowdsale start date.
    * @param _phase1ToPhase2Date Transition date between crowdsale's phase 1 and phase 2.
    * @param _phase2ToPhase3Date Transition date between crowdsale's phase 2 and phase 3.
    * @param _closingTime Crowdsale end date.
    * @param _wallet Destination wallet for all invested WEIs. (only in case when crowdsale is ended and if goal is reached)
    * @param _distributionAddresses Array of all distribution addresses (2 for founders, 2 for advisors, 1 for bounty, 1 for R&D and 1 for team reserve.
    */
    constructor(
        uint256 _goal,
        uint256 _defaultIndividualCap,
        uint256 _openingTime,
        uint256 _phase1ToPhase2Date,
        uint256 _phase2ToPhase3Date,
        uint256 _closingTime,
        address _wallet,
        address[] _distributionAddresses)
        PostDeliveryRefundableCrowdsale(_goal)
        ThreePhaseTimedCrowdsale(_openingTime, _phase1ToPhase2Date, _phase2ToPhase3Date, _closingTime)
        IndividuallyCappedWhitelistedCrowdsale(_defaultIndividualCap)
        Crowdsale(1, _wallet, new LibellumToken())
    public
    {
        libellumTokenDistribution = new LibellumTokenDistribution(
            _distributionAddresses,
            _phase2ToPhase3Date,
            LibellumToken(token),
            closingTime,
            address(this));
    }

    /**
    * @dev Updates the amount of tokens that will be distributed to airdrop contract.
    * Note that call is just delegated to distribution contract because of ownership.
    */
    function updateTokenAmountForAirdrop(uint256 _airdropTokens)
    public onlyOwner
    {
        libellumTokenDistribution.updateTokenAmountForAirdrop(_airdropTokens);
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
    * @dev As the last step of finalization is to prepare the token for distribution.
    * Note that in case if goal is not reached investors will not be able to claim refund
    * if finalize() function is not called by the owner. This is built-in behavior of
    * open zeppelin library so finalize() is not made accessible to non-owners.
    */
    function finalization() 
    internal
    {
        super.finalization();

        if (goalReached())
        {
            prepareTokenForDistribution();
        }
    }

    /**
    * @dev Token ownership is moved to distribution contract so the contract can mint new tokens during he distribution.
    * After the distribution contract is prepared as a last step ownership of distribution contract is moved to crowdsale owner,
    * so he can trigger the distribution after the crowdsale is finalized.
    */
    function prepareTokenForDistribution()
    internal
    {
        LibellumToken libellumToken = LibellumToken(token);
        libellumToken.transferOwnership(address(libellumTokenDistribution));
        libellumTokenDistribution.transferOwnership(owner);
    }
}