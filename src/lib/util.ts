import {BigNumber} from 'bignumber.js';
import {Expense} from 'components/expenses-context';
import {CalculationModes} from 'components/settings-context';
import dayjs from 'dayjs';

// helper for reducer
const bnAdd = (n1: BigNumber, n2: BigNumber) => n1.plus(n2);

// Given an array of expenses, it reduces it to an object with the 2 sums of btc and dollar prices
// The btc price calculation depends on the current user settings
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
    return {usdPrice, btcPrice: convertCurrency(usdPrice, currentPrice)};
  }
};

export const classNames = (...classes: string[]): string =>
  classes.filter(Boolean).join(' ');

export const isToday = (date: dayjs.Dayjs): boolean =>
  dayjs().diff(date, 'day') === 0;

export const convertCurrency = (
  amount: BigNumber,
  rate: BigNumber,
  precision = 8
): BigNumber =>
  rate.isEqualTo(0) ? new BigNumber(0) : amount.dividedBy(rate).dp(precision);
