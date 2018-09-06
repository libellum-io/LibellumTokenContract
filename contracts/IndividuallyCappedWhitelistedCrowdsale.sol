pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/crowdsale/validation/WhitelistedCrowdsale.sol";
import "openzeppelin-solidity/contracts/crowdsale/validation/IndividuallyCappedCrowdsale.sol";

contract IndividuallyCappedWhitelistedCrowdsale is IndividuallyCappedCrowdsale, WhitelistedCrowdsale {

    uint256 individualCap;
    
    constructor(uint256 _individualCap)
        public
    {
        require(_individualCap > 0, "Individual cap has to be greater than zero");
        individualCap = _individualCap;
    }
    
    /**
    * @dev 
    */
    function addAddressToWhitelist(address _operator)
        public
        onlyOwner
    {
        super.addAddressToWhitelist(_operator);
        caps[_operator] = individualCap;
    }

    /**
    * @dev Forbid setting custom beneficiary cap.
    */
    function setUserCap(
        address _beneficiary,
        uint256 _cap
    ) 
        external
        onlyOwner 
    {
        // NOP
    }

    /**
    * @dev Forbid setting custom beneficiary cap.
    */
    function setGroupCap(
        address[] _beneficiaries,
        uint256 _cap
    )
        external
        onlyOwner
    {
        // NOP
    }
}