# LIB Specifications
## Token Contract Construction
Total supply: 100’000’000 tokens  
Total tokens for sale: 50’000’000 tokens (private presale, public presale, public sale)  
Hard Cap: 3’700’000$  
Soft cap: 50’000$  
Contribution cap: 1’000 ETH (check for bigger pools during private pre sale → max 6’000 ETH)  
Mint: Tokens only minted for sales and distribution, no tokens mintable after TGE.  

## Contract Owner Functions
* Change owner
* Set Stage III end date
* Override stage exchange rate
* Collect ETH after TGE

## Stage Phases
![LIB Stages Timeline](https://github.com/libellum-io/LibellumTokenContract/blob/master/specs/LIBTokenStagesTimeline.PNG?raw=true)

### I Stage: 1. October ----> 15. October (Private PreSale)
minimum amount 5 ETH  
WhiteList lookup (hardcoded) / added by owner  
Rate: ETH tbd (0.05$)  

### II Stage: 16. October ----> 31. October (Public PreSale)
minimum amount 0.1 ETH  
Whitelist can only be added by owner  
Rate: ETH tbd (0.08$)  

### III Stage: 1. November ----> tbd	(Public Sale)
End of public sale to be set until the 31. Oct - If no public sale, the date is set to the start date.  
minimum amount 0.1 ETH  
Whitelist can only be added by owner  
Rate:  ETH tbd (0.10$)  

## Token Generation Event
### *Case 1: TGE*
Distribution will happen only if GOAL (soft cap) is met and when Crowdsale is finished. It is distributed with function finishPresale() only by contract owner;  

-- Distribution of tokens:
1. 10M total - to all founders (1/2 locked for 12 month)
2. 5M total - to all advisors (1/2 locked for 6 month)
3. 2.5M total - to all airdrop beneficiaries (hardcoded / added by owner?)
4. 15M total - to all r&d account (not locked)
5. 15M total - to reserve fund account (not locked)
6. 2.5M total - to bounty account (not locked)
1. 50M total - funding beneficiaries (private presale, public presale, public sale)
   1. Beneficiaries need to call withdrawTokens()
   1. Rest of the tokens will be burned

### *Case 2: Refund*
If GOAL is not met and Crowdsale is finished, tokens can't be minted (distributed), but ETH can be refunded when:
each beneficiary calls claimRefund() function.

### *Case 3: -*
If GOAL is met and Crowdsale is not finished:
do nothing
### *Case 4: -*
If GOAL is not met and Crowdsale is not finished:
do nothing

