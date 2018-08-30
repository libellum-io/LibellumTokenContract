pragma solidity ^0.4.23;

import "zeppelin-solidity/contracts/token/ERC20/SafeERC20.sol";

/**
 * @title LibellumTokenTimelock
 * @dev Token contract can be dynamically specified when releasing tokens.
 * With this approach we can create timelock contracts before ERC20 Libellum contract,
 * that will allow us to hardcode timelock's address directly into the Libellum contract.
 */
contract LibellumTokenTimelock { 
    using SafeERC20 for ERC20Basic;

    // beneficiary of tokens after they are released
    address public beneficiary;

    // timestamp when token release is enabled
    uint256 public releaseTime;

    constructor(
        address _beneficiary,
        uint256 _releaseTime
    )
        public
    {
        // solium-disable-next-line security/no-block-members
        require(_releaseTime > block.timestamp);
        beneficiary = _beneficiary;
        releaseTime = _releaseTime;
    }

    /**
    * @notice Transfers tokens held by timelock to beneficiary.
    */
    function release(ERC20Basic token) public {
        // solium-disable-next-line security/no-block-members
        require(block.timestamp >= releaseTime);

        uint256 amount = token.balanceOf(address(this));
        require(amount > 0);

        token.safeTransfer(beneficiary, amount);
    }
}