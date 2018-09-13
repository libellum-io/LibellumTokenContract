pragma solidity ^0.4.24;

import "./TokenDistributionBase.sol";
import "./Airdrop.sol";

contract UnlockedTokenDistribution is TokenDistributionBase {
    uint256 constant AIRDROP_TOKENS = 2500000000000000000000000; // 2.5 Mio LIB
    uint256 constant BOUNTY_TOKENS = 2500000000000000000000000; // 2.5 Mio LIB
    uint256 constant R_AND_D_TOKENS = 15000000000000000000000000; // 15 Mio LIB
    uint256 constant TEAM_RESERVE_FUND_TOKENS = 15000000000000000000000000; // 15 Mio LIB

    Airdrop public airdrop;

    address bountyPoolAddress;
    address rAndDPoolAddress;
    address teamReserveFundAddress;
    
    constructor (
        address _bountyPoolAddress,
        address _rAndDPoolAddress,
        address _teamReserveFundAddress) 
    public
    {
        require(_bountyPoolAddress != address(0), "_bountyPoolAddress can't be 0");
        require(_rAndDPoolAddress != address(0), "_rAndDPoolAddress can't be 0");
        require(_teamReserveFundAddress != address(0), "_teamReserveFundAddress can't be 0");
        bountyPoolAddress = _bountyPoolAddress;
        rAndDPoolAddress = _rAndDPoolAddress;
        teamReserveFundAddress = _teamReserveFundAddress;
    }

    function _distribute()
    internal
    {
        super._distribute();
        distributeAirdropTokens();
        distributeOtherTokens();
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

    /**
    * @dev Distribute tokens for bounty, R&D and team reserve fund.
    */
    function distributeOtherTokens()
    internal
    {
        _mintTokens(address(bountyPoolAddress), BOUNTY_TOKENS);
        _mintTokens(address(rAndDPoolAddress), R_AND_D_TOKENS);
        _mintTokens(address(teamReserveFundAddress), TEAM_RESERVE_FUND_TOKENS);
    }
}