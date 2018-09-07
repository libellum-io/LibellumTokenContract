pragma solidity ^0.4.24;

import "../crowdsale/LibellumCrowdsale.sol";
import "./DistributionBase.sol";
import "./LockedTokenDistribution.sol";

contract LibellumTokenDistribution is LockedTokenDistribution {

    constructor (LibellumCrowdsale _libellumCrowdsale)
        LockedTokenDistribution(_libellumCrowdsale.closingTime())
        DistributionBase(_libellumCrowdsale)
    public
    {
    }
}