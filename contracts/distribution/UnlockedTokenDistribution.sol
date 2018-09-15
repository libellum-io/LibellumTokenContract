pragma solidity ^0.4.24;

import "./TokenDistributionBase.sol";
import "./Airdrop.sol";

/**
* @dev Distributes the tokens directly to addresses without any TokenTimelocks (35 Mio LIB overall).
* All recepient addresses are pass thru constructor instead of Airdrop contract address, that is created implicitly
* and exposed as public variable.
*/
contract UnlockedTokenDistribution is TokenDistributionBase {
    uint256 constant MAX_AIRDROP_TOKENS = 2500000000000000000000000; // 2.5 Mio LIB
    uint256 constant BOUNTY_TOKENS = 2500000000000000000000000; // 2.5 Mio LIB
    uint256 constant R_AND_D_TOKENS = 15000000000000000000000000; // 15 Mio LIB
    uint256 constant TEAM_RESERVE_FUND_TOKENS = 15000000000000000000000000; // 15 Mio LIB

    // Defined after distribution is executed. It is exposed as public variable
    // so owner is able to execute airdrop by calling doAirdrop against list of recepients.
    Airdrop public airdrop;

    // Amount of LIB tokens that will be distributed to Airdrop contract.
    // By default it is set to MAX_AIRDROP_TOKENS, but owner can change it.
    uint256 public airdropTokens = MAX_AIRDROP_TOKENS;

    // end date after which airdropTokens can't be updated anymore
    uint256 updateAirdropTokenAmountEndDate;

    address bountyPoolAddress;
    address rAndDPoolAddress;
    address teamReserveFundAddress;
    
    constructor (
        uint256 _updateAirdropTokenAmountEndDate,
        address _bountyPoolAddress,
        address _rAndDPoolAddress,
        address _teamReserveFundAddress) 
    public
    {
        require(_updateAirdropTokenAmountEndDate >= block.timestamp, "_updateAirdropTokenAmountEndDate can't be from the past");
        require(_bountyPoolAddress != address(0), "_bountyPoolAddress can't be 0");
        require(_rAndDPoolAddress != address(0), "_rAndDPoolAddress can't be 0");
        require(_teamReserveFundAddress != address(0), "_teamReserveFundAddress can't be 0");
        updateAirdropTokenAmountEndDate = _updateAirdropTokenAmountEndDate;
        bountyPoolAddress = _bountyPoolAddress;
        rAndDPoolAddress = _rAndDPoolAddress;
        teamReserveFundAddress = _teamReserveFundAddress;
    }

    /**
    * @dev Updates the amount of tokens that will be distributed to airdrop contract.
    */
    function updateTokenAmountForAirdrop(uint256 _airdropTokens)
    public onlyOwner
    {
        require(_airdropTokens <= MAX_AIRDROP_TOKENS, "Tokens for airdrop can't exceed MAX_AIRDROP_TOKENS");
        require(updateAirdropTokenAmountEndDate >= block.timestamp, "updateAirdropTokenAmountEndDate reached, can't update anymore");
        airdropTokens = _airdropTokens;
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
        _mintTokens(address(airdrop), airdropTokens);
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