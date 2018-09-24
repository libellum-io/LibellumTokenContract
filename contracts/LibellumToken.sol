pragma solidity ^0.4.24;

import 'openzeppelin-solidity/contracts/token/ERC20/CappedToken.sol';

contract LibellumToken is CappedToken {
    // This minting cap is not necessary since minting will be limited by
    // crowdsale and distribution contracts. It is left here just as an assertation.
    uint256 MINTING_CAP = 100000000000000000000000000; // 100 Mio LIB

    string public symbol = "LIB";
    string public name = "Libellum Token";
    uint8 public decimals = 18;

    constructor() 
        CappedToken(MINTING_CAP)
    public
    {
    }
}