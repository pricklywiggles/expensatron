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
export type PriceDispatch = React.Dispatch<
  React.SetStateAction<BitcoinPriceInfo>
>;

const BitcoinPriceContext = React.createContext<
  [BitcoinPriceInfo, PriceDispatch]
>([defaultPriceInfo, () => null]);

const BitcoinPriceProvider: Component = ({children}) => {
  const [priceInfo, setPriceInfo] =
    React.useState<BitcoinPriceInfo>(defaultPriceInfo);
  const [settings] = useSettings();
  const isIntervalOn =
    settings.mode === CalculationModes.MARKET &&
    settings.refresh === RefreshModes.AUTO;

  // Immediately get price whenever we switch refresh modes
  React.useEffect(() => {
    refreshBTCPrice(setPriceInfo).catch((err) =>
      console.error('Could not fetch btc price when changing mode', err)
    );
  }, [settings.refresh]);

  React.useEffect(() => {
    console.log('Price of bitcoin is', priceInfo.amount.toString());
  }, [priceInfo.amount]);

  // Set up a callback to run the price update, keep it in sync when settings change.
  // Does not run when in manual mode or purchase mode.
  useInterval(
    () => {
      refreshBTCPrice(setPriceInfo).catch((err) => {
        console.error('Failed to get BTC Price in interval', err);
        // this will refresh the "last fetched at" message.
        setPriceInfo((prev) => ({...prev}));
      });
    },
    settings.pollIntervalSeconds * 1000,
    isIntervalOn
  );

  const contextValue = React.useMemo<[BitcoinPriceInfo, PriceDispatch]>(
    () => [priceInfo, setPriceInfo],
    [priceInfo]
  );

  return (
    <BitcoinPriceContext.Provider value={contextValue}>
      {children}
    </BitcoinPriceContext.Provider>
  );
};

export const refreshBTCPrice = (
  setPriceInfo: PriceDispatch
): Promise<BigNumber | void> =>
  getBTCPriceNow().then((price) => {
    setPriceInfo({amount: price, fetchedAt: dayjs()});
  });

const useBitcoinPriceDispatch = (): PriceDispatch => {
  const context = React.useContext(BitcoinPriceContext);
  if (context === null) {
    throw new Error('used useBitcoinPrice outside provider');
  }
  return context[1];
};

const useBitcoinPrice = (): BitcoinPriceInfo => {
  const context = React.useContext(BitcoinPriceContext);
  if (context === null) {
    throw new Error('used useBitcoinPrice outside provider');
  }
  return context[0];
};

export {BitcoinPriceProvider, useBitcoinPrice, useBitcoinPriceDispatch};
