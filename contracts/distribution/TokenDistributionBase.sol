pragma solidity ^0.4.24;

import "../LibellumToken.sol";
import "../crowdsale/LibellumCrowdsale.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

/**
* @dev Base class for all distribution sub-contracts. Exposes distribute() method which performs
* validation and executes all internal _distribute() function of all sub-contracts.
*/
contract TokenDistributionBase is Ownable {
    LibellumToken public token;
    uint256 public crowdsaleClosingTime;
    bool public isDistributed = false;

    /**
    * @dev Don't override this function to prevent loosing of validation.
    */
    function distribute(LibellumToken _token, uint256 _crowdsaleClosingTime)
    public
    {
        require(!isDistributed, "Tokens are already distributed");
        require(_token != address(0), "Passed token can't have 0 address");
        require(_token.owner() == address(this), "Contract needs to be the owner of the token to be able to distribute tokens");
        require(_crowdsaleClosingTime <= block.timestamp, "Crowdsale closing time is from the future");
        token = _token;
        crowdsaleClosingTime = _crowdsaleClosingTime;
        _distribute();
        isDistributed = true;
    }

    /**
    * @dev Override this function in order to distribute the tokens.
    */
    function _distribute()
    internal
    {
    }

    /**
    * @dev Use this function to mint the tokens.
    */
    function _mintTokens(address _beneficiary, uint256 _tokenAmount)
    internal
    {
        token.mint(_beneficiary, _tokenAmount);
    }
}