pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/crowdsale/distribution/RefundableCrowdsale.sol";
import "openzeppelin-solidity/contracts/crowdsale/distribution/PostDeliveryCrowdsale.sol";

/**
* @dev Merges zeppelin's PostDeliveryCrowdsale and RefundableCrowdsale contracts
* so it includes both contract behaviours. Additionally, it adds validation to prevent
* tokens withdraw in case if goal is not reached and crowdsale has ended.
*/
contract PostDeliveryRefundableCrowdsale is PostDeliveryCrowdsale, RefundableCrowdsale {
    
    /**
    * @param _goal Goal (soft cap) of the crowdsale campaign. Note that it is fixed value,
    * so Libellum crowdsale contract doesn't have a function to update it in case if during the
    * crowdsale ETH to USD price changes.
    */
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