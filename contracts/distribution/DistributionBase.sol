pragma solidity ^0.4.24;

import "../LibellumToken.sol";
import "../crowdsale/LibellumCrowdsale.sol";

contract DistributionBase {

    LibellumToken token;
    bool isDistributed = false;

    /**
    * @dev Don't override this function to prevent loosing the validation.
    */
    function distribute(LibellumToken _token)
    public
    {
        require(!isDistributed, "Tokens are already distributed");
        require(_token != address(0), "Passed token can't have 0 address.");
        require(_token.owner() == address(this), "Contract needs to be the owner of the token to be able to distribute tokens.");
        token = _token;
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