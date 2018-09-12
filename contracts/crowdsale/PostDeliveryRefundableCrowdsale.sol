pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/crowdsale/distribution/RefundableCrowdsale.sol";
import "openzeppelin-solidity/contracts/crowdsale/distribution/PostDeliveryCrowdsale.sol";

/**
* @dev Merges zeppelin's PostDeliveryCrowdsale and RefundableCrowdsale contracts
* so it includes both contract behaviours. Additionally, it adds validation to prevent
* tokens withdraw in case if goal is not reached and crowdsale has ended.
*/
contract PostDeliveryRefundableCrowdsale is PostDeliveryCrowdsale, RefundableCrowdsale {

    constructor(uint256 _goal)
        RefundableCrowdsale(_goal)
    public
    {
    }

    /**
    * @dev Override is needed to prevent minting of tokens in case if goal is not reached,
    * since there is possibility that someone will try to withdraw funds when crowdsale is ended.
    */
    function withdrawTokens() 
    public
    {
        require(goalReached(), "Goal is not reached, can't withdraw tokens!");
        super.withdrawTokens();
    }
}