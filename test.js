const BigNumber = require('bignumber.js');
const Venus = require('.');
const provider = 'http://3.10.133.254:8575';
const privateKey = '0x04fd4490c7fe1e857557bdf12b1132315a718c115dfef5d8ae41045a174e5215';
// const venus = new Venus(provider);
const venus = new Venus(provider, { privateKey, network: 'ropsten' });

const Web3 = require('web3');
const web3 = new Web3(provider);

(async function () {

  const block = await venus._provider.provider.getBlockNumber();
  console.log('block', block);

  const gasPrice = new BigNumber(await web3.eth.getGasPrice()).times(1.5).dp(0, 2).toNumber();
  let preDefinedGasValue = new BigNumber(500000).dp(0, 2).toNumber();
  let nonce = await web3.eth.getTransactionCount('0x58E312B1b0A16dF7F3D103cAB7BE438de301e534');
  // const gasLimit = new BigNumber(preDefinedGasValue).multipliedBy(new BigNumber(gasPrice)).dp(0, 2).toNumber();
  const gasLimit = new BigNumber(150000).dp(0, 2).toNumber();

  const options = {
    gasPrice: `0x${gasPrice.toString(16)}`,
    gas: `0x${preDefinedGasValue.toString(16)}`,
    value: '0x00',
    nonce: `0x${nonce.toString(16)}`,
    // chainId,
    // from: options.from,
    gasLimit: `0x${gasLimit.toString(16)}`,
  }
  console.log('options object', options);
  const trx = await venus.exitMarket(Venus.SXP, options); // Use [] for multiple
  console.log('Ethers.js transaction object', trx);

})().catch(console.error);
