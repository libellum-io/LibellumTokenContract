# LIB Specifications
| Token Name & Symbol | Libellum Token, LIB |
| ------------- | -----:|
| Phases | Private Presale, Public Presale, Crowdsale |
| Refund | yes, if soft cap is not reached |
| Tokens issued | Set at contract creation |
| Minimum contribution | Set for each phase |
| Maximum contribution | 1’000 ETH |
| Token Type | Utility Token |
| Token Generation | Minted at TGE |
| Vesting | None |
| Pausable | Not Possible |
| KYC | Whitelist |

## Token Contract Construction
Total supply: 100’000’000 tokens  
Total tokens for sale: 50’000’000 tokens (private presale, public presale, public sale)  
Hard Cap: 3’700’000$  

Contribution cap: Default 1’000 ETH, individual override with whitelist possible  
Mint: Tokens only minted for sales and distribution, no tokens mintable after TGE.  

## Contract Owner Functions
* Change owner
* Initiate TGE finishPresale()
* setAirdropTotal() - only possible before stage 3 
* updatePhase2Rate() - only possible before stage 2
* updatePhase3Rate() - only possible before stage 3
* Collect ETH after TGE

## Stage Phases
![LIB Stages Timeline](https://github.com/libellum-io/LibellumTokenContract/blob/master/specs/LIBTokenStagesTimeline3.PNG?raw=true)

### I Stage: 1. October ----> 15. October (Private PreSale)
minimum amount 5 ETH  
WhiteList lookup (hardcoded) / added by owner  
Rate: 0.05$, 4'175LIB/ETH - rate will be updated when initiating the contract  

### II Stage: 16. October ----> 31. October (Public PreSale)
minimum amount 0.1 ETH  
Whitelist can only be added by owner  
Rate: 0.08$, 2609LIB/ETH - rate will be updated before stage 2 updatePhase2Rate()

### III Stage: 1. November ----> 20. November (Public Sale)
End of public sale to be set until the 31. Oct - If no public sale, the date is set to the start date.  
minimum amount 0.1 ETH  
Whitelist can only be added by owner  
Rate: 0.10$, 2087LIB/ETH - rate will be updated before stage 3 updatePhase3Rate()

## Token Generation Event
### *Case 1: TGE*
Distribution will happen only if GOAL (soft cap) is met and when Crowdsale is finished. It is distributed with function finishPresale() only by contract owner;  

-- Distribution of tokens:
1. 10M total - to all founders (1/2 locked for 12 month)
2. 5M total - to all advisors (1/2 locked for 6 month)
3. 2.5M total - to all airdrop beneficiaries (not locked)
   1. Function to distribute to addresses with number of tokens -  added by owner
   1. Burn function for rest of tokens
4. 2.5M total - to bounty account (1 hardcoded address, not locked)
5. 15M total - to r&d account (1 hardcoded address, not locked)
6. 15M total - to reserve fund account (1 hardcoded address, not locked)
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

