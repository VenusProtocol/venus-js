// Example of fetching a Venus protocol contract address with Venus.js
const Venus = require('../../dist/nodejs/index.js');

const batAddress = Venus.util.getAddress(Venus.BAT);
const cbatAddress = Venus.util.getAddress(Venus.cBAT);
const cEthAddressRopsten = Venus.util.getAddress(Venus.cETH, 'ropsten');

console.log('BAT (mainnet)', batAddress);
console.log('cBAT (mainnet)', cbatAddress);

console.log('cETH (ropsten)', cEthAddressRopsten);
