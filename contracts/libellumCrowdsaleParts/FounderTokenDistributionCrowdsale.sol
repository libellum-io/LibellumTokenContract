pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/crowdsale/distribution/FinalizableCrowdsale.sol";
import "openzeppelin-solidity/contracts/token/ERC20/TokenTimelock.sol";

contract FounderTokenDistributionCrowdsale is FinalizableCrowdsale {
    uint256 constant UNLOCKED_TOKENS_FOR_FOUNDERS = 5000000000000000000000000; // 5 Mio LIB
    uint256 constant LOCKED_TOKENS_FOR_FOUNDERS = 5000000000000000000000000; // 5 Mio LIB
    uint256 constant FOUNDER_LOCK_TIME = 31536000; // 1 year (365 days)

    address founder1;
    address founder2;
    TokenTimelock founder1TokenTimelock;
    TokenTimelock founder2TokenTimelock;

    constructor(address _founder1, address _founder2)
    public
    {
        require(_founder1 != address(0), "Founder1 address can't be 0");
        require(_founder2 != address(0), "Founder2 address can't be 0");
        founder1 = _founder1;
        founder2 = _founder2;
        founder1TokenTimelock = new TokenTimelock(token, founder1, closingTime + FOUNDER_LOCK_TIME);
        founder2TokenTimelock = new TokenTimelock(token, founder2, closingTime + FOUNDER_LOCK_TIME);
    }

    /**
    * @dev Distribute all tokens to registered parties.
    */
    function finalization()
    internal
    {
        super.finalization();

        uint256 unlockedTokensPerFounder = UNLOCKED_TOKENS_FOR_FOUNDERS / 2;
        _deliverTokens(founder1, unlockedTokensPerFounder);
        _deliverTokens(founder2, unlockedTokensPerFounder);

        uint256 lockedTokensPerFounder = LOCKED_TOKENS_FOR_FOUNDERS / 2;
        _deliverTokens(founder1TokenTimelock, lockedTokensPerFounder);
        _deliverTokens(founder2TokenTimelock, lockedTokensPerFounder);
    }
}