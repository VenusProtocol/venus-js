// Example of fetching prices from the Venus protocol's open price feed using
// Venus.js
const Venus = require('../../dist/nodejs/index.js');
const venus = new Venus();

let price;
(async function() {

  price = await venus.getPrice(Venus.SXP);
  console.log('SXP in USDC', price);

  price = await venus.getPrice(Venus.vSXP);
  console.log('vSXP in USDC', price);

  price = await venus.getPrice(Venus.SXP, Venus.vUSDC);
  console.log('SXP in vUSDC', price);

  price = await venus.getPrice(Venus.SXP, Venus.BNB);
  console.log('SXP in BNB', price);

})().catch(console.error);
