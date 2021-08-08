import BigNumber from 'bignumber.js';
import dayjs from 'dayjs';
import {useInterval} from 'hooks/use-interval';
import {getBTCPriceNow} from 'lib/util';
import * as React from 'react';
import {Component} from 'types/common';
import {CalculationModes, RefreshModes, useSettings} from './settings-context';

const defaultPriceInfo = {
  amount: new BigNumber(0),
  fetchedAt: dayjs()
};

export type BitcoinPriceInfo = typeof defaultPriceInfo;

const BitcoinPriceContext =
  React.createContext<BitcoinPriceInfo>(defaultPriceInfo);

const BitcoinPriceProvider: Component = ({children}) => {
  const [priceInfo, setPriceInfo] = React.useState(defaultPriceInfo);
  const [settings] = useSettings();
  const isIntervalOn =
    settings.mode === CalculationModes.MARKET &&
    settings.refresh === RefreshModes.AUTO;

  // Immediately get price whenever we go from manual to auto
  React.useEffect(() => {
    if (settings.refresh === RefreshModes.AUTO)
      getBTCPriceNow()
        .then((price) => {
          setPriceInfo({amount: price, fetchedAt: dayjs()});
        })
        .catch((err) => console.log('Could not fetch btc price', err));
  }, [settings.refresh]);

  React.useEffect(() => {
    console.log('Price of bitcoin is', priceInfo.amount.toString());
  }, [priceInfo.amount]);

  // Set up a callback to run the price update, keep it in sync when settings change.
  // Does not run when in manual mode or purchase mode.
  useInterval(
    () => {
      getBTCPriceNow()
        .then((price) => {
          setPriceInfo({amount: price, fetchedAt: dayjs()});
        })
        .catch((err) => console.log('Failed to get BTC Price', err));
    },
    settings.pollIntervalSeconds * 1000,
    isIntervalOn
  );

  return (
    <BitcoinPriceContext.Provider value={priceInfo}>
      {children}
    </BitcoinPriceContext.Provider>
  );
};

const useBitcoinPrice = (): BitcoinPriceInfo => {
  const context = React.useContext(BitcoinPriceContext);
  if (context === null) {
    throw new Error('used useBitcoinPrice outside provider');
  }
  return context;
};

export {BitcoinPriceProvider, useBitcoinPrice};
