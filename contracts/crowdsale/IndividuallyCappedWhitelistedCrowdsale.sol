pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/crowdsale/validation/WhitelistedCrowdsale.sol";
import "openzeppelin-solidity/contracts/crowdsale/validation/IndividuallyCappedCrowdsale.sol";

/**
* @dev Uses the default individual cap for each whitelisted member but owner is able to set custom cap.
*/
contract IndividuallyCappedWhitelistedCrowdsale is IndividuallyCappedCrowdsale, WhitelistedCrowdsale {

    uint256 defaultIndividualCap;
    
    constructor(uint256 _defaultIndividualCap)
    public
    {
        defaultIndividualCap = _defaultIndividualCap;
    }
    
    /**
    * @dev Overrides base behaviour so that together with whitelisting
    * a beneficiary default individual cap is set for that beneficiary.
    */
    function addAddressToWhitelist(address _operator)
    public onlyOwner
    {
        super.addAddressToWhitelist(_operator);
        caps[_operator] = defaultIndividualCap;
    }

    /**
    * @dev Adding beneficiary to whitelist with specific individual cap.
    */
    function addAddressToWhitelistWithCustomIndividualCap(address _operator, uint256 _specificIndividualCap)
    public onlyOwner
    {
        super.addAddressToWhitelist(_operator);
        caps[_operator] = _specificIndividualCap;
    }
}
