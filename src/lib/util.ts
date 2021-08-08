import {BigNumber} from 'bignumber.js';
import {Expense} from 'components/expenses-context';
import {CalculationModes} from 'components/settings-context';
import dayjs from 'dayjs';

// In the real world, these would be much more robust, perhaps with fallback to another
// apis and better error handling.

/**
 * Gets the btc equivalent of a usd amount from the blockchain.info api
 */
export const getBTCFromUSDAtMarket = async (
  usdAmount: BigNumber
): Promise<BigNumber> => {
  const endpoint = `https://blockchain.info/tobtc?currency=USD&value=${usdAmount.toString()}`;
  console.log(endpoint);
  return fetch(endpoint)
    .then((data) => data.json())
    .then((res) => new BigNumber(res));
};

/**
 * Gets the price of one bitcoin (asks API for the price of 1 million USD then calculates the price of 1)
 * This is to ensure we don't incur loss (1M is 6 decimal places more precise than asking for the btc price of 1 dollar)
 * @returns price of 1 btc
 */
export const getBTCPriceNow = async (): Promise<BigNumber> => {
  const oneMillion = new BigNumber(1000000);
  return getBTCFromUSDAtMarket(oneMillion).then((v) =>
    oneMillion.dividedBy(v).dp(8)
  );
};

/**
 * Fetches the price of 1 bitcoin at a particular date in history from the coindesk API
 * @param date
 * @returns price of 1 bitcoin as a BigNumber
 */
export const getBTCPriceAtDate = async (
  date: dayjs.Dayjs = dayjs()
): Promise<BigNumber> => {
  const formattedDate = date.format('YYYY-MM-DD');
  const endpoint = `https://api.coindesk.com/v1/bpi/historical/close.json?start=${formattedDate}&end=${formattedDate}`;
  console.log(endpoint);
  return fetch(endpoint)
    .then((data) => data.json())
    .then((res) => new BigNumber(res.bpi[formattedDate]))
    .catch((err) => {
      console.error('Error getting bitcoin price', err);
      return new BigNumber(0);
    });
};

/**
 * Converts a usd amount to btc taking care of rounding errors.
 *
 * @param usdPrice usd to convert
 * @param btcPrice current price of 1 bitcoin
 * @returns usd to btc rounded to 8 decimal places.
 */
export const convertUSDToBTC = (
  usdPrice: BigNumber,
  btcPrice: BigNumber
): BigNumber =>
  btcPrice.isEqualTo(0) ? new BigNumber(0) : usdPrice.dividedBy(btcPrice).dp(8);

const bnAdd = (n1: BigNumber, n2: BigNumber) => n1.plus(n2);

export const addExpenseListPrices = (
  expenses: Expense[],
  calculationMode: CalculationModes,
  currentPrice: BigNumber
): {usdPrice: BigNumber; btcPrice: BigNumber} => {
  // If we're calculating based on date of receipt, we add up both expense amounts
  if (calculationMode !== CalculationModes.MARKET) {
    return expenses.reduce(
      (acc, expense) => ({
        btcPrice: acc.btcPrice.plus(expense.btcPrice),
        usdPrice: acc.usdPrice.plus(expense.usdPrice)
      }),
      {usdPrice: new BigNumber(0), btcPrice: new BigNumber(0)}
    );
  } else {
    // If using market rates, we add up usdPrices then convert and return both.
    const usdPrice = expenses
      .map((expense) => expense.usdPrice)
      .reduce(bnAdd, new BigNumber(0));
    return {usdPrice, btcPrice: convertUSDToBTC(usdPrice, currentPrice)};
  }
};

export const classNames = (...classes: string[]): string =>
  classes.filter(Boolean).join(' ');
