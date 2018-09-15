pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/crowdsale/validation/WhitelistedCrowdsale.sol";
import "openzeppelin-solidity/contracts/crowdsale/validation/IndividuallyCappedCrowdsale.sol";

/**
* @dev Uses the same individual cap for each whitelisted member and frobits owner to set custom cap.
*/
contract IndividuallyCappedWhitelistedCrowdsale is IndividuallyCappedCrowdsale, WhitelistedCrowdsale {

    uint256 individualCap;
    
    constructor(uint256 _individualCap)
    public
    {
        require(_individualCap > 0, "Individual cap has to be greater than zero");
        individualCap = _individualCap;
    }
    
    /**
    * @dev Overrides base behaviour so that together with whitelisting
    * a beneficiary individual cap is set for that beneficiary.
    */
    function addAddressToWhitelist(address _operator)
    public onlyOwner
    {
        super.addAddressToWhitelist(_operator);
        caps[_operator] = individualCap;
    }

    /**
    * @dev Forbid setting custom beneficiary cap.
    */
    function setUserCap(
        address _beneficiary,
        uint256 _cap) 
    external onlyOwner 
    {
        revert("User cap can't be changed");
    }

    /**
    * @dev Forbid setting custom beneficiary cap.
    */
    function setGroupCap(
        address[] _beneficiaries,
        uint256 _cap)
    external onlyOwner
    {
        revert("Group cap can't be changed");
    }
}