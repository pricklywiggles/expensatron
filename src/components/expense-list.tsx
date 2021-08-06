import * as React from 'react';
import {Expense as TExpense, useExpenses} from './expenses-context';
import {Expense} from './expense';
import {PlusIcon} from './icons';

const ExpenseList = (): JSX.Element => {
  const [expenses] = useExpenses();
  return (
    <>
      {expenses.map(({id, merchant, date, usdPrice, btcPrice}: TExpense) => (
        <Expense
          key={id}
          id={id}
          merchant={merchant}
          date={date}
          usdPrice={usdPrice}
          btcPrice={btcPrice}
        />
      ))}
      <div>
        <PlusIcon className="h-20 w-20" />
      </div>
    </>
  );
};

export {ExpenseList};
