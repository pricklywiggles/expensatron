import * as React from 'react';
import {Expense as TExpense, useExpenses} from './expenses-context';
import {Expense} from './expense';
import {AddExpense} from './add-expense';
import {PriceBadge} from './price-badge';
import {CalculationModes, useSettings, Settings} from './settings-context';
import {useBitcoinPrice} from './bitcoin-price-manager';
import {addExpenseListPrices} from 'lib/util';
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';

dayjs.extend(relativeTime);

const getUpdateMessage = (settings: Settings): string => {
  switch (settings.mode) {
    case CalculationModes.PURCHASE:
      return 'Bitcoin prices historically calculated from receipt dates';
    case CalculationModes.MARKET:
      return `Bitcoin price last fetched ${dayjs().toNow()}`;
  }
};

const ExpenseList = (): JSX.Element => {
  const [mounted, setMounted] = React.useState(false);
  const currentBTCPrice = useBitcoinPrice();
  const [expenses] = useExpenses();
  const [settings] = useSettings();

  // avoid rendering on server to avoid content warning
  React.useEffect(() => setMounted(true), []);

  const {usdPrice, btcPrice} = addExpenseListPrices(
    expenses,
    settings.mode,
    currentBTCPrice.amount
  );

  if (!mounted) return null;

  return (
    <>
      <div className="flex flex-col text-center">
        <div className="flex justify-center">
          <div className="relative">
            <PriceBadge
              className="transform scale-150"
              color="bg-green-100"
              usdPrice={usdPrice}
              btcPrice={btcPrice}
            />
          </div>
        </div>
        <div className="text-gray-500 text-sm italic pt-6 sm:pt-4 pb-10">
          {getUpdateMessage(settings)}
        </div>
      </div>

      <div className="max-w-3xl mx-auto overflow-hidden shadow rounded-lg">
        <ul className="divide-y divide-gray-200">
          {expenses.map(
            ({id, merchant, date, usdPrice, btcPrice, memo}: TExpense) => (
              <li key={id}>
                <Expense
                  key={id}
                  id={id}
                  merchant={merchant}
                  date={date}
                  usdPrice={usdPrice}
                  btcPrice={btcPrice}
                  memo={memo}
                />
              </li>
            )
          )}
        </ul>
      </div>
      <div className="py-6">
        <AddExpense />
      </div>
    </>
  );
};

export {ExpenseList};
