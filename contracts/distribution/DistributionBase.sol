pragma solidity ^0.4.24;

import "../LibellumToken.sol";
import "../crowdsale/LibellumCrowdsale.sol";

contract DistributionBase {

    LibellumCrowdsale libellumCrowdsale;
    LibellumToken token;

    bool isDistributed;
    
    constructor (LibellumCrowdsale _libellumCrowdsale) 
    public
    {
        token = LibellumToken(_libellumCrowdsale.token());
    }

    /**
    * @dev Don't override this function to prevent loosing the validation.
    */
    function distribute()
    public
    {
        require(!isDistributed, "Tokens are already distributed");
        require(libellumCrowdsale.isFinalized(), "Can't distribute tokens since crowdsale is not finalized.");
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