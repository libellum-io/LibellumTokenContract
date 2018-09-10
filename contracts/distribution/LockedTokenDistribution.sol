pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/TokenTimelock.sol";
import "./DistributionBase.sol";

contract LockedTokenDistribution is DistributionBase, Ownable {
    uint256 constant FOUNDER_LOCK_TIME = 31536000; // 1 year (365 days)
    uint256 constant ADVISOR_LOCK_TIME = 15768000; // 6 months

    uint256 crowdsaleClosingTime;

    bool areAddressesSet = false;
    address[] addresses;
    TokenTimelock[] tokenTimelocks;

    uint256[] halfTokenAmounts = 
    [
        2500000000000000000000000, // founder 1: 2.5 Mio LIB (unlocked) => 5 Mio LIB overall
        2500000000000000000000000, // founder 2: 2.5 Mio LIB (unlocked) => 5 Mio LIB overall
        1250000000000000000000000, // advisor 1: 1.25 Mio LIB (unlocked) => 2.5 Mio LIB overall
        1250000000000000000000000  // advisor 2: 1.25 Mio LIB (unlocked) => 2.5 Mio LIB overall
    ];

    uint256[] lockTimes = 
    [
        FOUNDER_LOCK_TIME, // founder 1
        FOUNDER_LOCK_TIME, // founder 2
        ADVISOR_LOCK_TIME, // advisor 1
        ADVISOR_LOCK_TIME  // advisor 2
    ];

    constructor (uint256 _crowdsaleClosingTime) 
    public
    {
        crowdsaleClosingTime = _crowdsaleClosingTime;
    }

    function setFounderAndAdvisorAddresses(address[] _founderAddresses, address[] _advisorsAddresses)
    public onlyOwner
    {
        require(!areAddressesSet, "Addresses already set");
        require(_founderAddresses.length == 2, "Only 2 founders are allowed");
        require(_advisorsAddresses.length == 2, "Only 2 advisors are allowed");

        for (uint256 i = 0; i < _founderAddresses.length; i++)
        {
            require(_founderAddresses[i] != address(0), "Address can't be 0");
            addresses.push(_founderAddresses[i]);
        }

        for (i = 0; i < _advisorsAddresses.length; i++)
        {
            require(_advisorsAddresses[i] != address(0), "Address can't be 0");
            addresses.push(_advisorsAddresses[i]);
        }

        require (addresses.length == halfTokenAmounts.length, "halfTokenAmounts needs to have the same length as _addresses");
        require (addresses.length == lockTimes.length, "lockTimes needs to have the same length as _addresses");

        areAddressesSet = true;
    }

    function _distribute()
    internal
    {
        require(areAddressesSet, "Founders and advisors addresses need to be set before token distribution happens");
        
        for (uint256 i = 0; i < addresses.length; i++)
        {
            TokenTimelock tokenLockAddress = new TokenTimelock(token, addresses[i], crowdsaleClosingTime + lockTimes[i]);
            tokenTimelocks.push(tokenLockAddress);

            _mintTokens(addresses[i], halfTokenAmounts[i]);
            _mintTokens(tokenLockAddress, halfTokenAmounts[i]);
        }

        super._distribute();
    }
}