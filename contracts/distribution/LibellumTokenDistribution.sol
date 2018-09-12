pragma solidity ^0.4.24;

import "../LibellumToken.sol";
import "./DistributionBase.sol";
import "./LockedTokenDistribution.sol";

contract LibellumTokenDistribution is LockedTokenDistribution {

    constructor (address[] _founderAddresses, address[] _advisorsAddresses)
        LockedTokenDistribution(_founderAddresses, _advisorsAddresses)
    public
    {
    }
}