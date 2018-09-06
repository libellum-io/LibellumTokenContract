pragma solidity ^0.4.24;

import "./openzeppelin-solidity/contracts/crowdsale/Crowdsale.sol";
import "./openzeppelin-solidity/contracts/crowdsale/emission/MintedCrowdsale.sol";
import "./openzeppelin-solidity/contracts/crowdsale/validation/WhitelistedCrowdsale.sol";
import "./openzeppelin-solidity/contracts/crowdsale/validation/IndividuallyCappedCrowdsale.sol";
import "./openzeppelin-solidity/contracts/crowdsale/validation/TimedCrowdsale.sol";
import "./openzeppelin-solidity/contracts/crowdsale/distribution/RefundableCrowdsale.sol";
import "./openzeppelin-solidity/contracts/crowdsale/distribution/PostDeliveryCrowdsale.sol";

import "./LibellumToken.sol";

contract LibellumCrowdsale is PostDeliveryCrowdsale, RefundableCrowdsale, IndividuallyCappedCrowdsale, WhitelistedCrowdsale, MintedCrowdsale {
    uint8 constant PHASE1 = 1;
    uint8 constant PHASE2 = 2;
    uint8 constant PHASE3 = 3;

    mapping(uint8 => uint256) public ratesByPhase;
    mapping(uint8 => uint256) public minWeisByPhase;

    uint256 phase1ToPhase2Date;
    uint256 phase2ToPhase3Date;

    constructor(
        uint256 _goal,
        uint256 _startDate,
        uint256 _phase1ToPhase2Date,
        uint256 _phase2ToPhase3Date,
        uint256 _endDate,
        address _wallet)
        RefundableCrowdsale(_goal)
        TimedCrowdsale(_startDate, _endDate)
        Crowdsale(1, _wallet, new LibellumToken())
    public
    {
        require(_startDate <= _phase1ToPhase2Date, "_startDate > _phase1ToPhase2Date");
        require(_startDate <= _phase2ToPhase3Date, "_startDate > _phase2ToPhase3Date");
        require(_endDate >= _phase1ToPhase2Date, "_endDate < _phase1ToPhase2Date");
        require(_endDate >= _phase2ToPhase3Date, "_endDate < _phase2ToPhase3Date");
        phase1ToPhase2Date = _phase1ToPhase2Date;
        phase2ToPhase3Date = _phase2ToPhase3Date;

        ratesByPhase[PHASE1] = 4;
        ratesByPhase[PHASE2] = 2;
        ratesByPhase[PHASE3] = 1;

        minWeisByPhase[PHASE1] = 5000000000000000000; // 5 ether
        minWeisByPhase[PHASE2] = 100000000000000000; // 0.1 ether
        minWeisByPhase[PHASE3] = 100000000000000000; // 0.1 ether
    }

    /**
    * @dev Appending purchase validation with checking minimal amount of wei invested.
    */
    function _preValidatePurchase(address _beneficiary, uint256 _weiAmount)
        internal
    {
        super._preValidatePurchase(_beneficiary, _weiAmount);
        require(minWeisByPhase[resolveCurrentPhase()] <= _weiAmount, "Insufficient _weiAmount for investment");
    }

    /**
    * @dev Overriding token amount calculation since rate changes when
    * phases change.
    */
    function _getTokenAmount(uint256 _weiAmount)
        internal view returns (uint256)
    {
        uint256 currentRate = ratesByPhase[resolveCurrentPhase()];
        return _weiAmount.mul(currentRate);
    }

    /**
    * @dev Override is needed to prevent minting of tokens in case if goal is not reached,
    * since there is possibility that someone will try to withdraw funds when crowdsale is ended.
    */
    function withdrawTokens() 
    public
    {
        require(goalReached(), "Goal is not reached, can't mint tokens!");
        super.withdrawTokens();
    }

    function resolveCurrentPhase()
        internal view returns (uint8)
    {
        uint256 currentTimestamp = block.timestamp;
        if (currentTimestamp < phase1ToPhase2Date) return PHASE1;
        if (currentTimestamp >= phase1ToPhase2Date && currentTimestamp < phase2ToPhase3Date) return PHASE2;
        return  PHASE3;
    }
}