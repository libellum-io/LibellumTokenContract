pragma solidity ^0.4.24;

import "./TokenDistributionBase.sol";
import "./Airdrop.sol";

/**
* @dev Distributes the tokens directly to addresses without any TokenTimelocks (35 Mio LIB overall).
* All recepient addresses are pass thru constructor instead of Airdrop contract address, that is created implicitly
* and exposed as public variable.
*/
contract UnlockedTokenDistribution is TokenDistributionBase {
    uint256 constant AIRDROP_TOKENS = 2500000000000000000000000; // 2.5 Mio LIB
    uint256 constant BOUNTY_TOKENS = 2500000000000000000000000; // 2.5 Mio LIB
    uint256 constant R_AND_D_TOKENS = 15000000000000000000000000; // 15 Mio LIB
    uint256 constant TEAM_RESERVE_FUND_TOKENS = 15000000000000000000000000; // 15 Mio LIB

    // Defined after distribution is executed. It is exposed as public variable
    // so owner is able to execute airdrop by calling doAirdrop against list of recepients.
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
    * and as the last step transfers the ownership of the contract to
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