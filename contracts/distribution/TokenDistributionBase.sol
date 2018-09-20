pragma solidity ^0.4.24;

import "../LibellumToken.sol";
import "../crowdsale/LibellumCrowdsale.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

/**
* @dev Base class for all distribution sub-contracts. Exposes distribute() method which performs
* validation and executes all internal _distribute() function of all sub-contracts.
*/
contract TokenDistributionBase is Ownable {
    LibellumToken public libellumToken;
    uint256 public crowdsaleClosingTime;
    bool public isDistributed = false;

    constructor (LibellumToken _libellumToken, uint256 _crowdsaleClosingTime) 
    public
    {
        require(_libellumToken != address(0), "Passed token can't have 0 address");
        require(_crowdsaleClosingTime > 0, "Crowdsale closing time can't be zero");
        libellumToken = _libellumToken;
        crowdsaleClosingTime = _crowdsaleClosingTime;
    }

    /**
    * @dev Don't override this function to prevent loosing of validation.
    * Distribution can be executed after the crowdsale finalization is complited so the contract
    * is prepared for distribution (contract is owner of the token and the owner of the contract is
    * transfered to original owner). This function will triggerer all implemented distributions of the token.
    */
    function distribute()
    public onlyOwner
    {
        require(!isDistributed, "Tokens are already distributed");
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
        libellumToken.mint(_beneficiary, _tokenAmount);
    }
}