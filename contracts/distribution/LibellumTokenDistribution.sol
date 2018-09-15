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
    * @param _founderAddresses Array of founder addresses where tokens will be distributed to.
    * @param _advisorsAddresses Array of advisor addresses where tokens will be distributed to.
    * @param _updateAirdropTokenAmountEndDate Till this date founder can update airdrop token amount
    * @param _bountyPoolAddress Bounty pool address where tokens will be distributed to.
    * @param _rAndDPoolAddress R&D pool address where tokens will be distributed to.
    * @param _teamReserveFundAddress Team reserve fund address where tokens will be distributed to.
    */
    constructor (
        address[] _founderAddresses,
        address[] _advisorsAddresses,
        uint256 _updateAirdropTokenAmountEndDate,
        address _bountyPoolAddress,
        address _rAndDPoolAddress,
        address _teamReserveFundAddress)
        LockedTokenDistribution(_founderAddresses, _advisorsAddresses)
        UnlockedTokenDistribution(_updateAirdropTokenAmountEndDate, _bountyPoolAddress, _rAndDPoolAddress, _teamReserveFundAddress)
    public
    {
    }
}