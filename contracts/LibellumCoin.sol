pragma solidity ^0.4.23;

import 'zeppelin-solidity/contracts/token/ERC20/StandardToken.sol';

contract LibellumCoin is StandardToken {
    uint8 constant DECIMALS = 18;
    uint256 constant LIBELLUM_DECIMAL = (10 ** uint256(DECIMALS));

    uint256 constant TOTAL_COINS = 100000000 * LIBELLUM_DECIMAL;
    uint256 constant FOUNDER_COINS = 5000000 * LIBELLUM_DECIMAL;
    uint256 constant FOUNDER_TIMELOCK_COINS = 5000000 * LIBELLUM_DECIMAL;
    uint256 constant WALLET_CREATOR_COINS = 90000000 * LIBELLUM_DECIMAL;

    string public symbol = "LIB";
    string public name = "LibellumCoin";
    uint8 public decimals = DECIMALS;

    constructor(
        address founderAddress,
        address founderTimelockContractAddress
    )
    public
    {
        totalSupply_ = TOTAL_COINS;
        balances[founderAddress] = FOUNDER_COINS;
        balances[founderTimelockContractAddress] = FOUNDER_TIMELOCK_COINS;
        balances[msg.sender] = WALLET_CREATOR_COINS;
    }
}