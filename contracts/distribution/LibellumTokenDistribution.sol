pragma solidity ^0.4.24;

import "./LockedTokenDistribution.sol";
import "./UnlockedTokenDistribution.sol";

contract LibellumTokenDistribution is LockedTokenDistribution, UnlockedTokenDistribution {

    constructor (address[] _founderAddresses, address[] _advisorsAddresses)
        LockedTokenDistribution(_founderAddresses, _advisorsAddresses)
    public
    {
    }
}