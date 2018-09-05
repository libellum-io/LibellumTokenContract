1. October         ---->            15. September   (Private PreSale)
            I phase (Private PreSale)
            minimum amount 5 ETH
  WhiteList lookup (hardcoded) / added by owner
                Rate: 


16. October           ---->         31. October     (Public PreSale)
            II phase (Public PreSale)
            minimum amount 0.1 ETH
      Whitelist can only be added by owner
                Rate:

1. November           ---->         Unknown         (Public Sale)
            III phase (Crowdsale)
            minimum amount 0.1 ETH
      Whitelist can only be added by owner
                Rate: 

Case 1: 
    Distribution will happend only if GOAL (soft cap) is met and when Crowdsale is finished. It is distributed with function:
    finishPresale() only by owner;

    -- Distribution of tokens:
    1) to all founders (1/2 locked)
    2) to all advisors (1/2 locked)
    3) all other (not locked)
    4) additionaly beneficiaries need to call withdrawTokens()
    5) burn the rest of the tokens

Case 2: 
    If GOAL is not met and Crowdsale is finished, tokens can't be minted (distributed), but ETH can be refunded when:
    each beneficiary calls claimRefund() function.

Case 3: If GOAL is met and Crowdsale is not finished:
Case 4: If GOAL is not met and Crowdsale is not finished:
    do nothing

