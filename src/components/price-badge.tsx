import BigNumber from 'bignumber.js';
import {classNames} from 'lib/util';

type PriceBadgeProps = {
  className: string;
  color?: string;
  usdPrice: BigNumber;
  btcPrice: BigNumber;
};

const PriceBadge = ({
  className,
  usdPrice,
  btcPrice,
  color = 'bg-white'
}: PriceBadgeProps): JSX.Element => {
  return (
    <div className={className}>
      <div className="shadow-md rounded-md overflow-hidden flex flex-col sm:flex-row">
        <div
          className={classNames(
            'relative inline-flex items-center px-4 py-2  border-b-2 sm:border-b-0 sm:border-r-2 text-sm font-medium text-gray-700 bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500',
            color
          )}
        >
          <span className="transform scale-150 text-gray-400 pr-1">$</span>
          {usdPrice.toString()}
        </div>
        <div
          className={classNames(
            '-ml-px relative inline-flex items-center px-4 py-2    text-sm font-medium text-gray-700 bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500',
            color
          )}
        >
          <span className="transform scale-150 text-gray-400 pr-1">
            &#x20bf;
          </span>
          {btcPrice.toString()}
        </div>
      </div>
      {/* <div className="">
        <div>USD</div>
        <div>BTC</div>
      </div> */}
    </div>
  );
};

export {PriceBadge};
