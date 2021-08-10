import BigNumber from 'bignumber.js';
import dayjs from 'dayjs';
import {convertCurrency, isToday} from './util';

// In the real world, these can be more robust, perhaps with fallback to another
// apis and better error handling.

type CoinDeskData = {
  bpi: Record<string, number>;
  disclaimer: string;
  time: Record<string, string>;
};

// Fetch wrapper for easy replace if needed
const restClient = async <T extends unknown>(endpoint: string): Promise<T> =>
  window.fetch(endpoint).then((response) => response.json());

// Gets the btc equivalent of a usd amount from the blockchain.info api
const convertUSDToBTCAtCurrentPrice = async (
  usdAmount: BigNumber
): Promise<BigNumber> => {
  const endpoint = `https://blockchain.info/tobtc?currency=USD&value=${usdAmount.toString()}`;
  return restClient<string>(endpoint).then((data) => new BigNumber(data));
};

// Gets the price of BTC at day close on any given historical date.
const getHistoricalBTCPrice = async (
  date: dayjs.Dayjs = dayjs()
): Promise<BigNumber> => {
  const formattedDate = date.format('YYYY-MM-DD');
  const endpoint = `https://api.coindesk.com/v1/bpi/historical/close.json?start=${formattedDate}&end=${formattedDate}`;
  return restClient<CoinDeskData>(endpoint).then(({bpi}) => {
    if (bpi === undefined) {
      console.log('Could not get bitcoin price on', formattedDate);
    }
    return new BigNumber(bpi?.[formattedDate] ?? 0);
  });
};

// Gets the price of bitcoin at a given date.
// This is used for the price manager cache.
// Historical dates: Price of bitcoin for a past date comes from coindesk
// Today's price: Price of bitcoin is calculated from converting 1 million USD to BTC at blockchain.info
//
// Note: originally I was using 100MM (to maximize an 8 decimal place precision) but the api seems unstable with large numbers
const getBTCPrice = async (date: dayjs.Dayjs = dayjs()): Promise<BigNumber> => {
  let btcPrice: BigNumber;
  if (isToday(date)) {
    const oneMillionUSD = new BigNumber(1000000);
    btcPrice = await convertUSDToBTCAtCurrentPrice(
      new BigNumber(oneMillionUSD)
    ).then(
      (btc) => oneMillionUSD.dividedBy(btc).dp(8) // Cap precision of bitcoin at 8 decimals (satoshis)
    );
  } else {
    btcPrice = await getHistoricalBTCPrice(date);
  }
  return btcPrice;
};

// Converts USD to bitcoin by calling blockchain if date is today, coindesk if historical.
// This is used mostly for storage values of expenses.
const convertUSDToBTC = async (
  date: dayjs.Dayjs = dayjs(),
  usdPrice: BigNumber
): Promise<BigNumber> => {
  try {
    if (isToday(date)) {
      return await convertUSDToBTCAtCurrentPrice(usdPrice);
    } else {
      return convertCurrency(usdPrice, await getHistoricalBTCPrice(date));
    }
  } catch (err) {
    console.error('Error when converting USD', err);
    return new BigNumber(0);
  }
};

const api = {convertUSDToBTC, getBTCPrice};

export default api;
