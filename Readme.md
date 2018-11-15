# Preparing environment
0) Required: Node (npm package manager)
1) Install truffle as global package: npm install -g truffle
2) Install ganache client as global package: npm install -g ganache-cli
3) Clone this repository and position command line into it
4) Install all required packages: npm install

# Running tests
0) Required: ganache-cli to run (ganache-cli -a 20 --defaultBalanceEther 10000)
1) Run all tests: truffle test

# Specification
High-level specifications can be found in [specs](../master/specs) --> [LIBTokenSpecs.md](../master/specs/LIBTokenSpecs.md)

# Notes
1) The newest Solidity compiler (version 0.4.25) is not used since the latest truffle doesn't support it yet. Because of that version 0.4.24 is used instead.

# Deploying to main network
1) Start geth: geth --cache=1024 --datadir <path_to_a_folder> --rpc --rpcapi db,eth,net,web3,personal --rpcaddr <ip_address> --rpcport <port_number> --unlock="<from_address>"
2) Wait for geth to sync with the network (check from truffle console with: 'web3.eth.syncing' until it prints 'false')
3) Deploy the contract by running: truffle migrate --network live
