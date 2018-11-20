# LIB Specifications
| Token Name & Symbol | Libellum Token, LIB |
| :------------- | -----:|
| Total supply | 100’000’000 LIB |
| Total for sale | 50’000’000 LIB |
| Phases | Private Presale, Public Presale, Crowdsale |
| Hard cap | 3’700’000$ |
| Soft cap | 1 ETH (Libellum decided to not have a soft cap but not change the contract) |
| Refund | yes, if soft cap is not reached |
| Tokens issued | Set at contract creation |
| Minimum contribution | Set for each phase |
| Default maximum contribution | 1’000 ETH (override with whitelist possible)|
| Token Type | Utility Token |
| Token Generation | Minted at TGE |
| Vesting | None |
| Pausable | Not Possible |
| KYC | Whitelist |

## Contract Owner Functions
* Change owner
* updateTokenAmountForAirdrop() - only possible before stage 3 
* updatePhase2Rate() - only possible before stage 2
* updatePhase3Rate() - only possible before stage 3
* addAddressesToWhitelist() - with optional contribution cap override
* Initiate TGE with finalization()
* Distribute Airdrops with doAirdrop()


## Stage Phases
![LIB Stages Timeline](../specs/LIBTokenStagesTimeline.JPG?raw=true)  
*KYC, pledge and whitelist registration is covered in a separate process and therefore not part of this contract.*  

### I Stage: 15. November 11:00 AM UTC  --> 23. November 12:00 PM UTC (Private PreSale)
minimum amount 5 ETH  
WhiteList lookup (hardcoded) / added by owner  
Rate: 0.05$, 4198.60  LIB/ETH - rate will be updated when initiating the contract  

### II Stage: 24. November 0:00 AM UTC --> 5. December 12:00 PM UTC (Public PreSale)
minimum amount 0.1 ETH  
Whitelist can only be added by owner  
Rate: 0.08$, 2624.13 LIB/ETH - rate will be updated just before stage 2 - updatePhase2Rate()

### III Stage: 6. December 0:00 AM UTC --> 15. December 11:00 AM (Public Sale)
minimum amount 0.1 ETH  
Whitelist can only be added by owner  
Rate: 0.10$, 2099.30 LIB/ETH - rate will be updated just before stage 3 - updatePhase3Rate()

## Token Generation Event
### *Case 1: TGE*
Distribution will happen ~~only if GOAL (soft cap) is met and~~ when Crowdsale is finished. It is distributed with function finalization() only by contract owner;  

-- Distribution of tokens:
1. 10M total - to all founders (1/2 locked for 12 month)
2. 5M total - to all advisors (1/2 locked for 6 month)
3. 2.5M total - to all airdrop beneficiaries (not locked)
   1. Owner function to define total amount of tokens required (rest will not be minted)
   1. Owner function to distribute to addresses with number of tokens
4. 2.5M total - to bounty account (1 hardcoded address, not locked)
5. 15M total - to r&d account (1 hardcoded address, not locked)
6. 15M total - to reserve fund account (1 hardcoded address, not locked)
1. 50M total - funding beneficiaries (private presale, public presale, public sale)
   1. Beneficiaries need to call withdrawTokens()
   1. Rest of the tokens will be burned

### *Case 2: Refund*
As there is no real soft cap, refund is not an option anymore. TGE will happen for sure.
~~If GOAL is not met and Crowdsale is finished, tokens can't be minted (distributed), but ETH can be refunded when:~~
1. ~~finalize() has been called by Libellum~~
2. ~~each beneficiary calls claimRefund() function~~

## High-level Stage Flow
Following flows show which functions can/need to be called in which stage.  
![LIB Stages Flow 1](../specs/LIBStageFlow[Initiation-Stage1-Stage2]_v3.jpg?raw=true)  
![LIB Stages Flow 2](../specs/LIBStageFlow[Stage3-TGE]_v3.jpg?raw=true)  
