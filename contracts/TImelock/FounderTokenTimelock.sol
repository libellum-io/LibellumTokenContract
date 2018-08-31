pragma solidity ^0.4.23;

import "./TokenTimelockBase.sol";

/**
 * @title FounderTokenTimelock
 * @dev Uses TokenTimelock as base class and specifies release date
 * for Libellum token founder (1 year period).
 */
contract FounderTokenTimelock is TokenTimelockBase {
    
    constructor(address founderAddress) TokenTimelockBase(founderAddress, releaseDate()) public {
    }

    function releaseDate() public view returns (uint256) {
        return 1567296000; // 01-Sep-19
    } 
}