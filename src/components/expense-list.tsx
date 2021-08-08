import * as React from 'react';
import {Expense as TExpense, useExpenses} from './expenses-context';
import {Expense} from './expense';
import {AddExpense} from './add-expense';
import {PriceBadge} from './price-badge';
import {
  CalculationModes,
  useSettings,
  Settings,
  RefreshModes
} from './settings-context';
import {
  refreshBTCPrice,
  useBitcoinPrice,
  useBitcoinPriceDispatch
} from './bitcoin-price-manager';
import {addExpenseListPrices} from 'lib/util';
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';
import {RefreshIcon} from './icons';

dayjs.extend(relativeTime);

const getUpdateMessage = (
  settings: Settings,
  lastFetched: dayjs.Dayjs
): string => {
  console.log('yo');
  switch (settings.mode) {
    case CalculationModes.PURCHASE:
      return 'Bitcoin prices historically calculated from receipt dates';
    case CalculationModes.MARKET: {
      if (settings.refresh === RefreshModes.AUTO) {
        return `Bitcoin price last fetched ${lastFetched.fromNow()}`;
      }
      return `Bitcoin price last fetched at ${lastFetched.format('h:mm a')}`;
    }
  }
};

const ExpenseList = (): JSX.Element => {
  const [mounted, setMounted] = React.useState(false);
  const currentBTCPrice = useBitcoinPrice();
  const priceDispatch = useBitcoinPriceDispatch();
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

  const showRefresh =
    settings.mode === CalculationModes.MARKET &&
    settings.refresh === RefreshModes.MANUAL;

  return (
    <>
      <div className="flex flex-col text-center">
        <div className="flex justify-center">
          <div className="relative">
            <PriceBadge
              className="transform scale-125 sm:scale-150"
              color="bg-green-100"
              usdPrice={usdPrice}
              btcPrice={btcPrice}
            />
          </div>
        </div>
        <div className="">
          <div className="flex space-x-3 justify-center items-baseline">
            <div className="relative text-gray-500 text-xs sm:text-sm italic top-1 pt-6 sm:pt-4 pb-4 sm:pb-10">
              {getUpdateMessage(settings, currentBTCPrice.fetchedAt)}
            </div>
            {showRefresh ? (
              <button
                className="inline-flex relative top-2 justify-center hover:transform hover:scale-110 active:transform active:scale-90 border border-gray-400 hover:bg-yellow-200 items-center h-6 w-6 z-10 rounded-full bg-yellow-300"
                onClick={() => refreshBTCPrice(priceDispatch)}
              >
                <RefreshIcon className="h-5 text-blue-700" />
              </button>
            ) : null}
          </div>
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
