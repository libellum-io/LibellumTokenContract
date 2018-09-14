pragma solidity ^0.4.24;

import "./LockedTokenDistribution.sol";
import "./UnlockedTokenDistribution.sol";

/**
* @dev Has ability to perform distribution of the 40 Mio LIB tokens to founders, advisors,
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

    constructor (
        address[] _founderAddresses,
        address[] _advisorsAddresses,
        address _bountyPoolAddress,
        address _rAndDPoolAddress,
        address _teamReserveFundAddress)
        LockedTokenDistribution(_founderAddresses, _advisorsAddresses)
        UnlockedTokenDistribution(_bountyPoolAddress, _rAndDPoolAddress, _teamReserveFundAddress)
    public
    {
    }
}