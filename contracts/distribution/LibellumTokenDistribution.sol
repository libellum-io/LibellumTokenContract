pragma solidity ^0.4.24;

import "./LockedTokenDistribution.sol";
import "./UnlockedTokenDistribution.sol";

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