pragma solidity ^0.4.24;

import "../LibellumToken.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';

contract Airdrop is Ownable {
  using SafeMath for uint256;

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
    require(_recipients.length == _balances.length, "Arrays should have the same length");

    for (uint i = 0; i < _recipients.length; i++) 
    {
      require(_recipients[i] != address(0), "Recipient address can't be 0");
      require(_balances[i] > 0, "Balance has to be greater than 0");
      token.transfer(_recipients[i], _balances[i]);
    }
  }
}
