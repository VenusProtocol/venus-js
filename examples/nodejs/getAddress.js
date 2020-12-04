// Example of fetching a Venus protocol contract address with Venus.js
const Venus = require('../../dist/nodejs/index.js');

const sxpAddress = Venus.util.getAddress(Venus.SXP);
const vsxpAddress = Venus.util.getAddress(Venus.vSXP);
const vBNBAddressTestnet = Venus.util.getAddress(Venus.vBNB, 'testnet');

console.log('SXP (mainnet)', sxpAddress);
console.log('vSXP (mainnet)', vsxpAddress);

console.log('vBNB (testnet)', vBNBAddressTestnet);
