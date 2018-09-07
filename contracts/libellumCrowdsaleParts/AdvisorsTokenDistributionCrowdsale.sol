pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/crowdsale/distribution/FinalizableCrowdsale.sol";
import "openzeppelin-solidity/contracts/token/ERC20/TokenTimelock.sol";

contract AdvisorsTokenDistributionCrowdsale is FinalizableCrowdsale {
    uint256 constant UNLOCKED_TOKENS_FOR_ADVISORS = 2500000000000000000000000; // 2.5 Mio LIB
    uint256 constant LOCKED_TOKENS_FOR_ADVISORS = 2500000000000000000000000; // 2.5 Mio LIB
    uint256 constant ADVISOR_LOCK_TIME = 15768000; // 6 months

    address[] advisors;
    TokenTimelock[] advisorTokenTimelocks;

    constructor(address[] _advisors)
    public
    {
        require(_advisors.length != 0, "Advisors array can't be empty");

        for (uint256 i = 0; i <= _advisors.length; i++)
        {
            require(_advisors[i] != address(0), "Advisor address can't be 0");
            advisorTokenTimelocks.push(new TokenTimelock(token, _advisors[i], closingTime + ADVISOR_LOCK_TIME));
        }
        
        advisors = _advisors;
    }

    /**
    * @dev Distribute all tokens to registered parties.
    */
    function finalization()
    internal
    {
        super.finalization();

        uint256 unlockedTokensPerAdvisor = UNLOCKED_TOKENS_FOR_ADVISORS / advisors.length;
        uint256 lockedTokensPerAdvisor = LOCKED_TOKENS_FOR_ADVISORS / advisors.length;
        for (uint256 i = 0; i <= advisors.length; i++)
        {
            _deliverTokens(advisors[i], unlockedTokensPerAdvisor);
            _deliverTokens(advisors[i], lockedTokensPerAdvisor);
        }
    }
}