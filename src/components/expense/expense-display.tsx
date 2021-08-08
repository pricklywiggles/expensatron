import {CalendarIcon} from 'components/icons';
import {OptionsPopover} from 'components/options-popover';
import * as React from 'react';
import {
  deleteExpense,
  Expense as TExpense,
  useExpenseDispatch
} from '../expenses-context';
import {PriceBadge} from 'components/price-badge';
import {CalculationModes, useSettings} from 'components/settings-context';
import {useBitcoinPrice} from 'components/bitcoin-price-manager';
import {convertUSDToBTC} from 'lib/util';

type ExpenseDisplayProps = TExpense & {toggle: () => void};

const ExpenseDisplay = ({
  id,
  merchant,
  date,
  usdPrice,
  btcPrice,
  memo,
  toggle
}: ExpenseDisplayProps): JSX.Element => {
  const dispatch = useExpenseDispatch();
  const [settings] = useSettings();
  const {amount: oneBitcoin} = useBitcoinPrice();

  const displayBtcPrice =
    settings.mode === CalculationModes.MARKET
      ? convertUSDToBTC(usdPrice, oneBitcoin)
      : btcPrice;

  return (
    <div className="relative block bg-white">
      <div className="px-6 pt-4 pb-2 flex items-center">
        <div className="min-w-0 flex-1 sm:flexsm:items-center sm:justify-between">
          <div className="truncate">
            <div className="flex text-sm sm:text-md">
              <p className="font-medium text-indigo-500 truncate">{merchant}</p>
            </div>
            <div className="mt-2 flex">
              <div className="flex items-center text-xs sm:text-sm text-gray-500">
                <CalendarIcon
                  className="flex-shrink-0 mr-1.5 h-4 w-4 sm:h-5 sm:w-5 text-gray-400"
                  aria-hidden="true"
                />
                <p>
                  <time dateTime={date.format('MM/DD/YYYY')}>
                    {date.format('dddd MMMM D, YYYY')}
                  </time>
                </p>
              </div>
            </div>
            {memo ? (
              <div className="mt-2 flex">
                <div className="flex items-center text-xs sm:text-sm text-gray-300">
                  <p className="italic text-gray-400 truncate pr-1">{memo}</p>
                </div>
              </div>
            ) : null}
          </div>
          <div className="mt-4 flex-shrink-0 sdm:mt-0 sm:ml-5">
            <div className="flex overflow-hidden -space-x-1"></div>
          </div>
        </div>
        <PriceBadge
          className="transform scale-75 md:scale-100 pr-6 sm:pr-10 sm:-mt-4"
          color="bg-green-100"
          usdPrice={usdPrice}
          btcPrice={displayBtcPrice}
        />
        <div className="">
          <OptionsPopover
            onDelete={() => deleteExpense(dispatch, id)}
            onEdit={toggle}
          />
        </div>
      </div>
    </div>
  );
};

export {ExpenseDisplay};
