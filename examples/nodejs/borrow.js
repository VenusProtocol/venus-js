/** 
 * Example of supplying ETH to the Venus protocol with Venus.js
 *
 * Run ganache-cli in another command line window before running this script. Be
 *     sure to fork mainnet.

ganache-cli \
  -f https://mainnet.infura.io/v3/_YOUR_INFURA_ID_ \
  -m "clutch captain shoe salt awake harvest setup primary inmate ugly among become" \
  -i 1

 */

const Venus = require('../../dist/nodejs/index.js');

const myAddress = '0xa0df350d2637096571F7A701CBc1C5fdE30dF76A';
const privateKey = '0xb8c1b5c1d81f9475fdf2e334517d29f733bdfa40682207571b12fc1142cbf329';

const provider = 'http://localhost:8545';
const venus = new Venus(provider, { privateKey });

const getDaiBalance = (address) => {
  const daiAddress = Venus.util.getAddress(Venus.DAI);
  return Venus.eth.read(
    daiAddress,
    'function balanceOf(address) returns (uint256)',
    [ address ],
    { provider }
  );
};

(async function() {

  let myDaiBalance = await getDaiBalance(myAddress);
  console.log(`My Dai Balance: ${ (myDaiBalance / 1e18).toString() }`);

  console.log('Supplying 10 ETH...');
  const trx1 = await venus.supply(Venus.ETH, 10);

  console.log('Entering ETH market (use as collateral)...');
  const trx2 = await venus.enterMarkets(Venus.ETH); // also accepts []

  console.log('Borrowing Dai against ETH...');
  const trx3 = await venus.borrow(Venus.DAI, 32, { gasLimit: 500000 });

  myDaiBalance = await getDaiBalance(myAddress);
  console.log(`My Dai Balance: ${ (myDaiBalance / 1e18).toString() }`);

  // Exit a market (string argument of only 1 market at a time)
  // const trx = await venus.exitMarket(Venus.ETH);

})().catch(console.error);
