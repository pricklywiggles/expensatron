import BigNumber from 'bignumber.js';
import dayjs from 'dayjs';
import {useToggle} from 'hooks/use-toggle';
import * as React from 'react';
import {ExpenseEdit} from './expense/expense-edit';
import {PlusIcon} from './icons';

const AddExpense = (): JSX.Element => {
  const [isEditing, toggleEditMode] = useToggle(false);

  if (isEditing) {
    return (
      <ExpenseEdit
        className="min-w-lg max-w-xl mx-auto sm:px-0 space-y-6 rounded-lg shadow-lg overflow-hidden"
        id="0"
        merchant=""
        date={dayjs()}
        btcPrice={new BigNumber(0)}
        memo=""
        isNew
        toggle={toggleEditMode}
      />
    );
  } else {
    return (
      <div className="flex justify-center">
        <button
          type="button"
          className="inline-flex items-center px-6 py-3 border border-transparent hover:text-yellow-200 border-gray-300 shadow-lg text-xl font-medium rounded-full text-gray-100 bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={toggleEditMode}
        >
          <PlusIcon
            className="-ml-1 mr-3 h-10 w-10 hover:text-yellow-200"
            aria-hidden="true"
          />
          Add Expense
        </button>
      </div>
    );
  }
};

export {AddExpense};
