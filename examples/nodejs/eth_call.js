// Example of calling JSON RPC's eth_call with Venus.js
const Venus = require('../../dist/nodejs/index.js');

const cEthAddress = Venus.util.getAddress(Venus.cETH);

(async function() {

  const srpb = await Venus.eth.read(
    cEthAddress,
    'function supplyRatePerBlock() returns (uint256)',
    // [], // [optional] parameters
    // {}  // [optional] call options, provider, network, plus ethers "overrides"
  );

  console.log('cETH market supply rate per block:', srpb.toString());

})().catch(console.error);
