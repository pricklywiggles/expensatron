import {useToggle} from 'hooks/use-toggle';
import * as React from 'react';
import {Expense as TExpense} from '../expenses-context';
import {ExpenseDisplay} from './expense-display';
import {ExpenseEdit} from './expense-edit';

const Expense = ({
  id,
  merchant,
  date,
  usdPrice,
  btcPrice,
  memo
}: TExpense): JSX.Element => {
  const [isInEditMode, toggleEditMode] = useToggle(false);

  if (isInEditMode) {
    return (
      <ExpenseEdit
        className="border-2 rounded-lg border-red-500 overflow-hidden" //"min-w-lg max-w-xl mx-auto px-5 sm:px-0 space-y-6 rounded-lg"
        key={id}
        id={id}
        merchant={merchant}
        date={date}
        usdPrice={usdPrice}
        btcPrice={btcPrice}
        memo={memo}
        toggle={toggleEditMode}
      />
    );
  } else {
    return (
      <ExpenseDisplay
        key={id}
        id={id}
        merchant={merchant}
        date={date}
        usdPrice={usdPrice}
        btcPrice={btcPrice}
        memo={memo}
        toggle={toggleEditMode}
      />
    );
  }
};

export {Expense};
