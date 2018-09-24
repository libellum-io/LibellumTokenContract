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

    /**
    * @dev Optimized way of transfering tokens to the array of recipients.
    * This function is called from Airdrop contract to optimaze gas usage.
    * Solution copied from: https://medium.com/chainsecurity/token-muling-7c5127f37f30
    */
    function sendBatch(address[] _recipients, uint[] _values)
    external
    {
        require(_recipients.length == _values.length, "Arrays should have the same length");
        uint senderBalance = balances[msg.sender];
        for (uint i = 0; i < _values.length; i++) {
            uint value = _values[i];
            address to = _recipients[i];
            require(senderBalance >= value, "Insufficient funds");
            senderBalance = senderBalance - value;
            balances[to] += value;
            emit Transfer(msg.sender, to, value);
        }
        balances[msg.sender] = senderBalance;
    }
}