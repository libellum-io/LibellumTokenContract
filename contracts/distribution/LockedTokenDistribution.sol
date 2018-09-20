pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC20/TokenTimelock.sol";
import "./TokenDistributionBase.sol";

/**
* @dev Distributes the tokens to founders and advisors (15 Mio LIB overall).
* In order to lock half of the distributed tokens zeppelin's TokenTimelock contract is used.
* After lock time elapses all interested parties can retrieve addresses of Timelock contracts
* and they can release the funds to founders or advisors.
*/
contract LockedTokenDistribution is TokenDistributionBase {
    uint256 constant FOUNDER_LOCK_TIME = 31536000; // 1 year (365 days)
    uint256 constant ADVISOR_LOCK_TIME = 15768000; // 6 months
    
    // To simplify process of distribution both founders and advisors are put in single array.
    // Also each party has its token amount set in halfTokenAmounts array (one half goes directly to
    // founder or advisor and second half goes to TokenTimelock).
    address[] public addresses;
    uint256[] halfTokenAmounts = 
    [
        2500000000000000000000000, // founder 1: 2.5 Mio LIB (unlocked) => 5 Mio LIB overall
        2500000000000000000000000, // founder 2: 2.5 Mio LIB (unlocked) => 5 Mio LIB overall
        1250000000000000000000000, // advisor 1: 1.25 Mio LIB (unlocked) => 2.5 Mio LIB overall
        1250000000000000000000000  // advisor 2: 1.25 Mio LIB (unlocked) => 2.5 Mio LIB overall
    ];

    // Array where TokenTimelock contract addresses are kept.
    // This array is filled after distribute() function is executed.
    address[] public tokenTimelocks;

    uint256[] lockTimes = 
    [
        FOUNDER_LOCK_TIME, // founder 1
        FOUNDER_LOCK_TIME, // founder 2
        ADVISOR_LOCK_TIME, // advisor 1
        ADVISOR_LOCK_TIME  // advisor 2
    ];

    constructor (
        address _founderAddress1,
        address _founderAddress2,
        address _advisorsAddress1,
        address _advisorsAddress2) 
    public
    {
        require(_founderAddress1 != address(0), "_founderAddress1 can't be 0");
        require(_founderAddress2 != address(0), "_founderAddress2 can't be 0");
        require(_advisorsAddress1 != address(0), "_advisorsAddress1 can't be 0");
        require(_advisorsAddress2 != address(0), "_advisorsAddress2 can't be 0");

        addresses.push(_founderAddress1);
        addresses.push(_founderAddress2);
        addresses.push(_advisorsAddress1);
        addresses.push(_advisorsAddress2);
    }

    /**
    * @dev Goes thru addresses array and distribute (mint) half of the tokens for a party directly to the address
    * and second half goes to newly created TokenTimelock.
    */
    function _distribute()
    internal
    {
        super._distribute();

        for (uint256 i = 0; i < addresses.length; i++)
        {
            TokenTimelock tokenLockAddress = new TokenTimelock(token, addresses[i], crowdsaleClosingTime + lockTimes[i]);
            tokenTimelocks.push(address(tokenLockAddress));

            _mintTokens(addresses[i], halfTokenAmounts[i]);
            _mintTokens(tokenLockAddress, halfTokenAmounts[i]);
        }
    }
}