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
    address libellumCrowdsaleContractAddress;
    bool public isDistributed = false;

    constructor (
        LibellumToken _libellumToken,
        uint256 _crowdsaleClosingTime,
        address _libellumCrowdsaleContractAddress) 
    public
    {
        require(_libellumToken != address(0), "Passed token can't have 0 address");
        require(_crowdsaleClosingTime > 0, "Crowdsale closing time can't be zero");
        require(_libellumCrowdsaleContractAddress != address(0), "Crowdsale contract can't have  0 address");
        libellumToken = _libellumToken;
        crowdsaleClosingTime = _crowdsaleClosingTime;
        libellumCrowdsaleContractAddress = _libellumCrowdsaleContractAddress;
    }

    /**
    * @dev Don't override this function to prevent loosing of validation.
    * Distribution can be executed after the crowdsale finalization is complited so the contract
    * is prepared for distribution (contract is owner of the token and the owner of the contract is
    * transfered to original owner). This function will trigger all implemented distributions of the token.
    * As the last step token ownershep is returned to the crowdsale contract to allow beneficiaries to withdraw
    * their tokens.
    */
    function distribute()
    public onlyOwner
    {
        require(!isDistributed, "Tokens are already distributed");
        require(libellumToken.owner() == address(this), "Distribution contract is not owner of the token");
        _distribute();
        transferTokenOwnershipToCrowdsaleContract();
        isDistributed = true;
    }

    /**
    * @dev This step is needed to allow investors to withdrow their tokens from crowdsale contract
    * since withdrowTokens() operation triggers minting of new tokens.
    */
    function transferTokenOwnershipToCrowdsaleContract()
    private
    {
        libellumToken.transferOwnership(libellumCrowdsaleContractAddress);
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