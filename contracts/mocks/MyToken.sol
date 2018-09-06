pragma solidity ^0.4.23;

import 'openzeppelin-solidity/contracts/token/ERC20/StandardToken.sol';

contract MyToken is StandardToken {
    string public symbol = "MYT";
    string public name = "My Token";
    uint8 public decimals = 18;

    constructor(address someWallet) public {
        totalSupply_ = 100 * (10 ** 18);
        balances[someWallet] = totalSupply_;
    }
}