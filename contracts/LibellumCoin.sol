pragma solidity ^0.4.23;

import 'zeppelin-solidity/contracts/token/ERC20/StandardToken.sol';

contract LibellumCoin is StandardToken {
    uint256 constant NUMBER_OF_COINS = 100000000;

    string public symbol = "LIB";
    string public name = "LibellumCoin";
    uint8 public decimals = 18;

    constructor() public {
        totalSupply_ = NUMBER_OF_COINS * (10 ** uint256(decimals));
        balances[msg.sender] = totalSupply_;
    }
}