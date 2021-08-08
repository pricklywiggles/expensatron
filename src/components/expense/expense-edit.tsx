import * as React from 'react';
import {
  addExpense,
  editExpense,
  Expense as TExpense,
  useExpenseDispatch
} from '../expenses-context';
import {useForm} from 'controlled-form-hook';
import {Validators} from 'tiny-validation';
import {
  isNotFutureDate,
  isPositiveAmount,
  isValidBigNumber,
  isValidDate,
  isValidDollarAmount
} from 'lib/validators';
import BigNumber from 'bignumber.js';
import dayjs from 'dayjs';
import {ValidationErrors} from 'components/validation-errors';
const {isPresent, maxChars} = Validators;

type ExpenseEditProps = Omit<TExpense, 'usdPrice'> & {
  usdPrice?: BigNumber;
  className: string;
  isNew?: boolean;
  toggle: () => void;
};
type FormValues = Omit<TExpense, 'id' | 'btcPrice' | 'usdPrice' | 'date'> & {
  usdPrice: string;
  date: string;
};

const ExpenseEdit = ({
  className,
  id,
  merchant,
  date,
  usdPrice,
  memo,
  isNew,
  toggle
}: ExpenseEditProps): JSX.Element => {
  const dispatch = useExpenseDispatch();
  const [submitError, setSubmitError] = React.useState<string>(null);
  const onSubmit = async (formValues: FormValues) => {
    const values = {
      ...formValues,
      date: dayjs(formValues.date),
      usdPrice: new BigNumber(formValues.usdPrice)
    };
    if (isNew) {
      addExpense(dispatch, values)
        .then(() => toggle())
        .catch(() => {
          setSubmitError('Network error, please wait and try again');
          console.error('Error when submitting add form');
        });
    } else {
      editExpense(dispatch, {id, ...values})
        .then(() => toggle())
        .catch(() => {
          setSubmitError('Network error, please wait and try again');
          console.error('Error when submitting edit form');
        });
    }
  };
  const {
    handleSubmit,
    handleFieldChange,
    isSubmitting,
    isDisabled,
    values,
    visited,
    errors,
    reset
  } = useForm<FormValues>({
    onSubmit,
    schema: {
      merchant: [
        isPresent('Enter merchant name'),
        maxChars(30, '30 Character maximum')
      ],
      date: [isPresent('Enter a date'), isValidDate, isNotFutureDate],
      usdPrice: [
        isPresent('Enter amount in USD'),
        isValidBigNumber,
        isValidDollarAmount,
        isPositiveAmount
      ],
      memo: [maxChars(50, '50 character maximum')]
    },
    initialValues: {
      merchant,
      date: date.format('MM/DD/YYYY'),
      usdPrice: usdPrice?.toString(),
      memo
    }
  });

  const onCancel = () => {
    reset();
    toggle();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className={className}>
        <div className="bg-white shadow px-4 py-5  sm:p-6">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="mt-5 md:mt-0 md:col-span-3">
              <div className="grid grid-cols-6 gap-6">
                <div className="relative col-span-6 sm:col-span-4">
                  <div className=" border border-gray-300 rounded-md px-3 py-2 shadow-sm focus-within:ring-1 focus-within:ring-indigo-600 focus-within:border-indigo-600">
                    <label
                      htmlFor="merchant"
                      className="absolute -top-2 left-2 -mt-px inline-block px-2 bg-white text-xs font-medium text-gray-900"
                    >
                      Merchant Name
                    </label>
                    <input
                      type="text"
                      name="merchant"
                      id="merchant"
                      value={values['merchant']}
                      onChange={handleFieldChange}
                      className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
                    />
                  </div>
                  <div className="relative col-span-6 sm:col-span-4">
                    <ValidationErrors
                      visited={visited['merchant']}
                      errors={errors['merchant']}
                    />
                  </div>
                </div>
                <div className="relative col-span-6 sm:col-span-2">
                  <div className="border border-gray-300 rounded-md px-3 py-2 shadow-sm focus-within:ring-1 focus-within:ring-indigo-600 focus-within:border-indigo-600">
                    <label
                      htmlFor="price"
                      className="absolute -top-2 left-2 -mt-px inline-block px-1 bg-white text-xs font-medium text-gray-900"
                    >
                      Price
                    </label>
                    <div className="mt-1 relative rounded-mdshadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="text"
                        name="usdPrice"
                        id="usdPrice"
                        onChange={handleFieldChange}
                        value={values['usdPrice']}
                        className="block w-full pl-7 pr-12 border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
                        placeholder="0.00"
                        aria-describedby="price-currency"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span
                          className="text-gray-500 sm:text-sm"
                          id="price-currency"
                        >
                          USD
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="relative col-span-6 sm:col-span-4">
                    <ValidationErrors
                      visited={visited['usdPrice']}
                      errors={errors['usdPrice']}
                    />
                  </div>
                </div>
                <div className="relative col-span-6 sm:col-span-2 lg:col-span-2">
                  <div className=" border border-gray-300 rounded-md px-3 py-2 shadow-sm focus-within:ring-1 focus-within:ring-indigo-600 focus-within:border-indigo-600">
                    <label
                      htmlFor="name"
                      className="absolute -top-2 left-2 -mt-px inline-block px-1 bg-white text-xs font-medium text-gray-900"
                    >
                      Date
                    </label>
                    <input
                      type="text"
                      name="date"
                      id="date"
                      onChange={handleFieldChange}
                      value={values['date']}
                      className="block w-full h-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
                      placeholder="MM/DD/YY"
                    />
                  </div>
                  <div className="relative col-span-6 sm:col-span-2">
                    <ValidationErrors
                      visited={visited['date']}
                      errors={errors['date']}
                    />
                  </div>
                </div>
                <div className="relative col-span-6 sm:col-span-4 ">
                  <div className="border border-gray-300 rounded-md px-3 py-2 shadow-sm focus-within:ring-1 focus-within:ring-indigo-600 focus-within:border-indigo-600">
                    <label
                      htmlFor="name"
                      className="absolute -top-2 left-2 -mt-px inline-block px-1 bg-white text-xs font-medium text-gray-900"
                    >
                      Memo
                    </label>
                    <input
                      type="text"
                      name="memo"
                      id="memo"
                      value={values['memo']}
                      onChange={handleFieldChange}
                      className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
                    />
                  </div>
                  <div className="relative col-span-6 sm:col-span-2">
                    <ValidationErrors
                      visited={visited['memo']}
                      errors={errors['memo']}
                    />
                  </div>
                </div>
              </div>
              <div className="text-red-400 w-full">{submitError}</div>
              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={onCancel}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isDisabled}
                  className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 disabled:opacity-20 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export {ExpenseEdit};
