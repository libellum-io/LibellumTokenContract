pragma solidity ^0.4.24;

import "../LibellumToken.sol";
import "./DistributionBase.sol";
import "./LockedTokenDistribution.sol";

contract LibellumTokenDistribution is LockedTokenDistribution {

    constructor (LibellumToken _token, uint256 _crowdsaleClosingTime)
        LockedTokenDistribution(_crowdsaleClosingTime)
        DistributionBase(token)
    public
    {
    }
}