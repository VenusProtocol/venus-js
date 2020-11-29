// Example of fetching a Venus protocol contract address with Venus.js
const Venus = require('../../dist/nodejs/index.js');

const sxpAddress = Venus.util.getAddress(Venus.SXP);
const vsxpAddress = Venus.util.getAddress(Venus.vSXP);
const vBNBAddressRopsten = Venus.util.getAddress(Venus.vBNB, 'ropsten');

console.log('SXP (mainnet)', sxpAddress);
console.log('vSXP (mainnet)', vsxpAddress);

console.log('vBNB (ropsten)', vBNBAddressRopsten);
