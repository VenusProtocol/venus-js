// Example of fetching prices from the Venus protocol's open price feed using
// Venus.js
const Venus = require('../../dist/nodejs/index.js');
const venus = new Venus();

let price;
(async function() {

  price = await venus.getPrice(Venus.BAT);
  console.log('BAT in USDC', price);

  price = await venus.getPrice(Venus.cBAT);
  console.log('cBAT in USDC', price);

  price = await venus.getPrice(Venus.BAT, Venus.cUSDC);
  console.log('BAT in cUSDC', price);

  price = await venus.getPrice(Venus.BAT, Venus.ETH);
  console.log('BAT in ETH', price);

})().catch(console.error);
