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
    bool public isPreparedForDistribution = false;
    bool public isDistributed = false;

    /**
    * @dev Don't override this function to prevent loosing of validation.
    * This function should only be called by the crowdsale contract during finalization, so the ownership of
    * distribution contract needs first to be transfered to crowdsale contract.
    * WARNING: Any other owner that is not crowdsale contract should never call this function!
    */
    function prepareForDistribution(LibellumToken _token, uint256 _crowdsaleClosingTime)
    public onlyOwner
    {
        require(!isPreparedForDistribution, "Contract is already prepared for distribution");
        require(_token != address(0), "Passed token can't have 0 address");
        require(_token.owner() == address(this), "Contract needs to be the owner of the token to be able to distribute tokens");
        require(_crowdsaleClosingTime <= block.timestamp, "Crowdsale closing time is from the future");
        token = _token;
        crowdsaleClosingTime = _crowdsaleClosingTime;
        isPreparedForDistribution = true;
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
        require(isPreparedForDistribution, "Contract first needs to be prepared for distribution");
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
        token.mint(_beneficiary, _tokenAmount);
    }
}