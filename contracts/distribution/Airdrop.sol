pragma solidity ^0.4.24;

import "../LibellumToken.sol";
import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';

/**
* @dev Created after crowdsale during token distribution. This will help owner
* to trigger airdrop on multiple recepients.
*/
contract Airdrop is Ownable {
    LibellumToken token;

    constructor(LibellumToken _token)
    public
    {
        require(_token != address(0), "LibellumToken address can't be 0");
        token = _token;
    }

    function doAirdrop(address[] _recipients, uint256[] _balances)
    public onlyOwner
    {
        token.sendBatch(_recipients, _balances);
    }
}
