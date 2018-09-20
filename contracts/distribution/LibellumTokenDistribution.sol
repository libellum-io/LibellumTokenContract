pragma solidity ^0.4.24;

import "./LockedTokenDistribution.sol";
import "./UnlockedTokenDistribution.sol";

/**
* @dev Has ability to perform distribution of max 50 Mio LIB tokens to founders, advisors,
* bounties, R&D and team reserve funds accounts. Distribution is done by using the minting operation
* against LibellumToken. In order to enable minting, crowdsale contract needs to transfer ownership
* of LibellumToken to this contract.
*
* Inheritance graph:
*                   TokenDistributionBase
*                       /          \
* LockedTokenDistribution          UnlockedTokenDistribution
*                       \          /
*                 LibellumTokenDistribution
*/
contract LibellumTokenDistribution is LockedTokenDistribution, UnlockedTokenDistribution {

    /**
    * @param _distributionAddresses Array of all distribution addresses (2 for founders, 2 for advisors, 1 for bounty, 1 for R&D and 1 for team reserve.
    * @param _updateAirdropTokenAmountEndDate Till this date founder can update airdrop token amount
    */
    constructor (address[] _distributionAddresses, uint256 _updateAirdropTokenAmountEndDate)
        LockedTokenDistribution(_distributionAddresses[0], _distributionAddresses[1], _distributionAddresses[2], _distributionAddresses[3])
        UnlockedTokenDistribution(_updateAirdropTokenAmountEndDate, _distributionAddresses[4], _distributionAddresses[5], _distributionAddresses[6])
    public
    {
    }
}