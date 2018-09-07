pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/crowdsale/distribution/FinalizableCrowdsale.sol";

contract OtherTokensDistributionCrowdsale is FinalizableCrowdsale {

    address[] founders;
    address[] advisors;

    constructor(
        address[] _founders,
        address[] _advisors)
    public
    {

    }

    /**
    * @dev Distribute all tokens to registered parties.
    */
    function finalization()
    internal
    {
        super.finalization();
    }
}