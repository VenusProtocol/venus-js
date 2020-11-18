const Venus = require('.');
const provider = 'http://3.10.133.254:8575';
const privateKey = '0x58E312B1b0A16dF7F3D103cAB7BE438de301e534';
// const venus = new Venus(provider);
const venus = new Venus(provider, { privateKey, network: 'ropsten' });

(async function () {

  const block = await venus._provider.provider.getBlockNumber();
  console.log('block', block);

  const trx = await venus.enterMarkets(Venus.SXP); // Use [] for multiple
  console.log('Ethers.js transaction object', trx);

})().catch(console.error);
