pragma solidity ^0.4.23;

import 'zeppelin-solidity/contracts/token/ERC20/MintableToken.sol';

contract LibellumToken is MintableToken {
    string public symbol = "LIB";
    string public name = "Libellum Token";
    uint8 public decimals = 18;
}