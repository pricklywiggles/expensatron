import {useLocalStorageState} from 'hooks/use-local-storage';
import {useToggle} from 'hooks/use-toggle';
import * as React from 'react';
import {WithChildren} from 'types/common';

// Modes for calculating bitcoin prices
// PURCHASE: Bitcoin price fetched historically based on receipt date
// MANUAL: Bitcoin price fetched on demand
// AUTO: Bitcoin price polled at at interval.
export enum CalculationModes {
  PURCHASE = 0,
  MARKET = 1
}

export enum RefreshModes {
  MANUAL = 0,
  AUTO = 1
}

const defaultSettings = {
  mode: CalculationModes.PURCHASE,
  refresh: RefreshModes.MANUAL,
  pollIntervalSeconds: 10
};

export type Settings = typeof defaultSettings;

type SettingsDispatch = React.Dispatch<React.SetStateAction<Settings>>;
type SettingsModalToggle = () => void;

const SettingsContext =
  React.createContext<
    [Settings, SettingsDispatch, boolean, SettingsModalToggle]
  >(null);

const SettingsProvider = ({children}: WithChildren): JSX.Element => {
  const [settings, setSettings] = useLocalStorageState(
    'settings',
    defaultSettings
  );
  const [isOpen, toggle] = useToggle(false);

  return (
    <SettingsContext.Provider value={[settings, setSettings, isOpen, toggle]}>
      {children}
    </SettingsContext.Provider>
  );
};

const useSettings = (): [
  Settings,
  SettingsDispatch,
  boolean,
  SettingsModalToggle
] => {
  const context = React.useContext(SettingsContext);
  if (typeof context === 'undefined') {
    throw new Error('useSettings called from outside SettingsContext');
  }
  return context;
};

const changeName = (dispatch: SettingsDispatch, name: string): void =>
  dispatch((prev) => ({...prev, name}));

const changePollInterval = (
  dispatch: SettingsDispatch,
  newPollIntervalSeconds: number
): void =>
  dispatch((prev) => ({
    ...prev,
    pollIntervalSeconds: newPollIntervalSeconds
  }));

export {SettingsProvider, useSettings, changeName, changePollInterval};
