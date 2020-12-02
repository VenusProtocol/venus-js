/**
 * @file Price Feed
 * @desc These methods facilitate interactions with the Open Price Feed smart
 *     contracts.
 */

import * as eth from './eth';
import { netId } from './helpers';
import {
  constants, address, abi, cTokens, underlyings, decimals, opfAssets
} from './constants';
import { BigNumber } from '@ethersproject/bignumber/lib/bignumber';
import { CallOptions } from './types';

function validateAsset(
  asset: string,
  argument: string,
  errorPrefix: string
) : (boolean | string | number)[] {
  if (typeof asset !== 'string' || asset.length < 1) {
    throw Error(errorPrefix + 'Argument `' + argument + '` must be a non-empty string.');
  }

  const assetIsVToken = asset[0] === 'v';

  const vTokenName = assetIsVToken ? asset : 'v' + asset;
  const vTokenAddress = address[this._network.name][vTokenName];

  let underlyingName = assetIsVToken ? asset.slice(1, asset.length) : asset;
  const underlyingAddress = address[this._network.name][underlyingName];

  if (
    (!cTokens.includes(vTokenName) || !underlyings.includes(underlyingName)) &&
    !opfAssets.includes(underlyingName)
  ) {
    throw Error(errorPrefix + 'Argument `' + argument + '` is not supported.');
  }

  const underlyingDecimals = decimals[underlyingName];

  // The open price feed reveals BTC, not WBTC.
  underlyingName = underlyingName === 'WBTC' ? 'BTC' : underlyingName;

  return [assetIsVToken, vTokenName, vTokenAddress, underlyingName, underlyingAddress, underlyingDecimals];
}

async function vTokenExchangeRate(
  vTokenAddress: string,
  vTokenName: string,
  underlyingDecimals: number
) : Promise<number> {
  const address = vTokenAddress;
  const method = 'exchangeRateCurrent';
  const options = {
    _compoundProvider: this._provider,
    abi: vTokenName === constants.vBNB ? abi.vBNB : abi.vBep20,
  };
  const exchangeRateCurrent = await eth.read(address, method, [], options);
  const mantissa = 18 + underlyingDecimals - 8; // vToken always 8 decimals
  const oneVTokenInUnderlying = exchangeRateCurrent / Math.pow(10, mantissa);

  return oneVTokenInUnderlying;
}

/**
 * Gets an asset's price from the Venus Protocol open price feed. The price
 *    of the asset can be returned in any other supported asset value, including
 *    all vTokens and underlyings.
 *
 * @param {string} asset A string of a supported asset in which to find the
 *     current price.
 * @param {string} [inAsset] A string of a supported asset in which to express
 *     the `asset` parameter's price. This defaults to USD.
 *
 * @returns {string} Returns a string of the numeric value of the asset.
 *
 * @example
 * ```
 * const venus = new Venus(window.ethereum);
 * let price;
 * 
 * (async function () {
 * 
 *   price = await venus.getPrice(Venus.BNB);
 *   console.log('BNB in USD', price);
 * 
 *   price = await venus.getPrice(Venus.SXP, Venus.USDC); // supports vTokens too
 *   console.log('SXP in USDC', price);
 * 
 * })().catch(console.error);
 * ```
 */
export async function getPrice(
  asset: string,
  inAsset: string = constants.USDC
) : Promise<number> {
  await netId(this);
  const errorPrefix = 'Venus [getPrice] | ';

  const [
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    assetIsVToken, vTokenName, vTokenAddress, underlyingName, underlyingAddress, underlyingDecimals
  ] = validateAsset.bind(this)(asset, 'asset', errorPrefix);

  const [
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    inAssetIsVToken, inAssetVTokenName, inAssetVTokenAddress, inAssetUnderlyingName, inAssetUnderlyingAddress, inAssetUnderlyingDecimals
  ] = validateAsset.bind(this)(inAsset, 'inAsset', errorPrefix);

  // const priceFeedAddress = address[this._network.name].PriceFeed;
  const comptrollerAddress = address[this._network.name].Comptroller;

  const oracleTrxOptions: CallOptions = {
    _compoundProvider: this._provider,
    abi: abi.Comptroller,
  };
  const priceOracleAddress = await eth.read(comptrollerAddress, 'oracle', [], oracleTrxOptions);

  // const trxOptions: CallOptions = {
  //   _compoundProvider: this._provider,
  //   abi: abi.PriceFeed,
  // };

  // const assetUnderlyingPrice = await eth.read(priceFeedAddress, 'price', [ underlyingName ], trxOptions);
  // const inAssetUnderlyingPrice =  await eth.read(priceFeedAddress, 'price', [ inAssetUnderlyingName ], trxOptions);

  const trxOptions: CallOptions = {
    _compoundProvider: this._provider,
    abi: abi.PriceOracle,
  };
  let assetUnderlyingPrice = await eth.read(priceOracleAddress, 'getUnderlyingPrice', [ vTokenAddress ], trxOptions);
  const inAssetUnderlyingPrice =  await eth.read(priceOracleAddress, 'getUnderlyingPrice', [ inAssetVTokenAddress ], trxOptions);

  const assetDecimal = decimals[asset];
  const inAssetDecimal = decimals[inAsset];
  if ((assetDecimal-inAssetDecimal) > 0) {
    assetUnderlyingPrice = assetUnderlyingPrice.mul(BigNumber.from("10").pow(assetDecimal-inAssetDecimal));
  } else {
    assetUnderlyingPrice = assetUnderlyingPrice.div(BigNumber.from("10").pow(inAssetDecimal-assetDecimal));
  }  

  let assetVTokensInUnderlying, inAssetVTokensInUnderlying;

  if (assetIsVToken) {
    assetVTokensInUnderlying = await vTokenExchangeRate.bind(this)(vTokenAddress, vTokenName, underlyingDecimals);
  }

  if (inAssetIsVToken) {
    inAssetVTokensInUnderlying = await vTokenExchangeRate.bind(this)(inAssetVTokenAddress, inAssetVTokenName, inAssetUnderlyingDecimals);
  }

  let result;
  if (!assetIsVToken && !inAssetIsVToken) {
    result = assetUnderlyingPrice / inAssetUnderlyingPrice;
  } else if (assetIsVToken && !inAssetIsVToken) {
    const assetInOther = assetUnderlyingPrice / inAssetUnderlyingPrice;
    result = assetInOther * assetVTokensInUnderlying;
  } else if (!assetIsVToken && inAssetIsVToken) {
    const assetInOther = assetUnderlyingPrice / inAssetUnderlyingPrice;
    result = assetInOther / inAssetVTokensInUnderlying;
  } else {
    const assetInOther = assetUnderlyingPrice / inAssetUnderlyingPrice;
    const vTokensInUnderlying = assetInOther / assetVTokensInUnderlying;
    result = inAssetVTokensInUnderlying * vTokensInUnderlying;
  }

  return result;
}
