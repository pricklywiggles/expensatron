import BigNumber from 'bignumber.js';
import {Expense} from 'components/expenses-context';
import dayjs from 'dayjs';
import * as React from 'react';

const deserializeExpenseProperties = (expense: Expense) => ({
  ...expense,
  date: dayjs(expense.date),
  usdPrice: new BigNumber(expense.usdPrice),
  btcPrice: new BigNumber(expense.btcPrice)
});

// In the real world, this would be encrypted.
const serialize = JSON.stringify;
const deserialize = JSON.parse;
export const deserializeExpenses = (expensesInput: string): Expense[] => {
  try {
    return JSON.parse(expensesInput).map(deserializeExpenseProperties);
  } catch (error) {
    // This would need to be way more robust
    return [];
  }
};

// peristent store, for now it's localstorage. Deals with SSR state as well.
const store = {
  getItem: (key: string) => {
    if (typeof window !== 'undefined') {
      return window.localStorage.getItem(key);
    }
    console.error('Attempted to get localStorage while on server');
    return null;
  },
  setItem: (key: string, value: string) => {
    if (typeof window !== 'undefined') {
      return window.localStorage.setItem(key, value);
    }
    console.error('Attempted to set localStorage while on server');
    return null;
  }
};

/**
 * React.useState, but for localStorage. Used to simulate some remote persistent storage.
 *
 * @param key The key to set in localStorage for this value
 * @param defaultValue The value to use if it is not already in localStorage
 * @param {{serialize: Function, deserialize: Function}} options The serialize and deserialize functions to use (defaults to JSON.stringify and JSON.parse respectively)
 */

type fn<T> = () => T;

const useLocalStorageState = <T extends unknown>(
  key: string,
  defaultValue?: T | fn<T>,
  customDeserialize: (value: string) => T = deserialize
): [T, React.Dispatch<T>] => {
  const [state, setState] = React.useState<T>(() => {
    // During SSR, we keep the default value
    const value = store.getItem(key);
    if (value) {
      return customDeserialize(value);
    }
    return defaultValue instanceof Function ? defaultValue() : defaultValue;
  });
  React.useDebugValue(`${key}: ${serialize(state)}`);

  React.useEffect(() => {
    store.setItem(key, serialize(state));
  }, [key, state]);

  return [state, setState];
};

export {useLocalStorageState};
