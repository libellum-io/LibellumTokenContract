pragma solidity ^0.4.24;

import "./DistributionBase.sol";
import "./Airdrop.sol";

contract UnlockedTokenDistribution is DistributionBase {
    uint256 constant AIRDROP_TOKENS = 2500000000000000000000000; // 2.5 Mio LIB

    Airdrop public airdrop;
    
    constructor () 
    public
    {   
    }

    function _distribute()
    internal
    {
        super._distribute();
        distributeAirdropTokens();
    }

    /**
    * @dev Creates an Airdrop contract, delivers the tokens to it
    * and as the last step ownership of the contract is transfer to
    * distribution contract's owner.
    */
    function distributeAirdropTokens()
    internal
    {
        airdrop = new Airdrop(token);
        _mintTokens(address(airdrop), AIRDROP_TOKENS);
        airdrop.transferOwnership(owner);
    }
}