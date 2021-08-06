import {BigNumber} from 'bignumber.js';
import {fetchBTCPrice} from 'lib/util';
import * as React from 'react';
import {v4 as uuidv4} from 'uuid';

export type Expense = {
  id: string;
  merchant: string;
  date: Date;
  usdPrice: BigNumber;
  btcPrice: BigNumber;
};
type ExpenseDispatch = React.Dispatch<React.SetStateAction<Expense[]>>;

const ExpenseContext = React.createContext<Expense[]>([]);
const ExpenseDispatchContext = React.createContext(null);

const ExpenseProvider = ({children}: WithChildren): JSX.Element => {
  const [expenses, setExpenses] = React.useState<Expense[]>([]);

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
  if (typeof dispatch === 'undefined') {
    throw new Error('useSettings called from outside SettingsContext');
  }
  return dispatch;
};

const addExpense = async (
  dispatch: ExpenseDispatch,
  {merchant, usdPrice, date}: Omit<Expense, 'id' | 'btcPrice'>
): Promise<void> => {
  const id = uuidv4();
  const btcPrice: BigNumber = await fetchBTCPrice(usdPrice);
  const newExpense: Expense = {id, merchant, usdPrice, btcPrice, date};
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
  {id, merchant, usdPrice, date}: Omit<Expense, 'btcPrice'>
): Promise<void> => {
  const btcPrice: BigNumber = await fetchBTCPrice(usdPrice);
  const updatedExpense: Expense = {id, merchant, usdPrice, btcPrice, date};
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
