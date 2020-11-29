// Example of calling JSON RPC's eth_call with Venus.js
const Venus = require('../../dist/nodejs/index.js');

const vSxpAddress = Venus.util.getAddress(Venus.vSXP);

(async function() {

  const srpb = await Venus.eth.read(
    vSxpAddress,
    'function supplyRatePerBlock() returns (uint256)',
    // [], // [optional] parameters
    // {}  // [optional] call options, provider, network, plus ethers "overrides"
  );

  console.log('vSXP market supply rate per block:', srpb.toString());

})().catch(console.error);
