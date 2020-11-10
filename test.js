const Venus = require('.');
const provider = 'http://3.10.133.254:8575';
const venus = new Venus(provider);

(async function () {
  const block = await venus._provider.getBlockNumber();
  console.log('-- block', block)
})().catch(console.error);
