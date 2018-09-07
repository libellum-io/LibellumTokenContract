pragma solidity ^0.4.24;

import "../LibellumToken.sol";

contract DistributionBase {

    LibellumToken token;

    bool isDistributed;
    
    constructor (LibellumToken _token) 
    public
    {
        token = _token;
    }

    /**
    * @dev Don't override this function to prevent loosing the validation.
    */
    function distribute()
    public
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
        token.mint(_beneficiary, _tokenAmount);
    }
}