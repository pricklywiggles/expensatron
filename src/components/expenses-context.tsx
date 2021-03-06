import {BigNumber} from 'bignumber.js';
import * as React from 'react';
import {WithChildren} from 'types/common';
import {v4 as uuidv4} from 'uuid';
import dayjs from 'dayjs';
import {
  deserializeExpenses,
  useLocalStorageState
} from 'hooks/use-local-storage';
import api from 'lib/api';

export const emptyExpense = {
  id: '',
  merchant: '',
  date: dayjs(),
  memo: '',
  usdPrice: new BigNumber(0),
  btcPrice: new BigNumber(0)
};

export type Expense = typeof emptyExpense;

type ExpenseDispatch = React.Dispatch<React.SetStateAction<Expense[]>>;

const ExpenseContext = React.createContext<Expense[]>([]);
const ExpenseDispatchContext = React.createContext(null);

const ExpenseProvider = ({children}: WithChildren): JSX.Element => {
  const [expenses, setExpenses] = useLocalStorageState<Expense[]>(
    'expenses',
    () => [],
    deserializeExpenses
  );

  return (
    <ExpenseContext.Provider value={expenses}>
      <ExpenseDispatchContext.Provider value={setExpenses}>
        {children}
      </ExpenseDispatchContext.Provider>
    </ExpenseContext.Provider>
  );
};

const useExpenses = (): [Expense[], ExpenseDispatch] => [
  React.useContext(ExpenseContext),
  React.useContext(ExpenseDispatchContext)
];

const useExpenseDispatch = (): ExpenseDispatch => {
  const dispatch = React.useContext(ExpenseDispatchContext);
  if (dispatch === null) {
    throw new Error('useSettings called from outside SettingsContext');
  }
  return dispatch;
};

const addExpense = async (
  dispatch: ExpenseDispatch,
  {merchant, usdPrice, date, memo}: Omit<Expense, 'id' | 'btcPrice'>
): Promise<void> => {
  const id = uuidv4();
  const btcPrice = await api.convertUSDToBTC(date, usdPrice);
  const newExpense: Expense = {id, merchant, usdPrice, btcPrice, date, memo};
  dispatch((prev) => [...prev, newExpense]);
};

const deleteExpense = async (
  dispatch: ExpenseDispatch,
  id: string
): Promise<void> => {
  dispatch((prev) => prev.filter((expense) => expense.id !== id));
};

const editExpense = async (
  dispatch: ExpenseDispatch,
  {id, merchant, usdPrice, date, memo}: Omit<Expense, 'btcPrice'>
): Promise<void> => {
  const btcPrice = await api.convertUSDToBTC(date, usdPrice);
  const updatedExpense: Expense = {
    id,
    merchant,
    usdPrice,
    btcPrice,
    date,
    memo
  };
  dispatch((prev) =>
    prev.map((expense) => (expense.id === id ? updatedExpense : expense))
  );
};

export {
  ExpenseProvider,
  useExpenses,
  useExpenseDispatch,
  addExpense,
  deleteExpense,
  editExpense
};
