import * as React from 'react';
import {WithChildren} from 'types/common';

const defaultSettings = {
  name: '',
  avatar: 0,
  pollIntervalSeconds: 0
};

type Settings = typeof defaultSettings;

type SettingsDispatch = React.Dispatch<React.SetStateAction<Settings>>;

const SettingsContext = React.createContext(null);

const SettingsProvider = ({children}: WithChildren): JSX.Element => {
  const [settings, setSettings] = React.useState(defaultSettings);

  return (
    <SettingsContext.Provider value={[settings, setSettings]}>
      {children}
    </SettingsContext.Provider>
  );
};

const useSettings = (): [Settings, SettingsDispatch] => {
  const context = React.useContext(SettingsContext);
  if (typeof context === 'undefined') {
    throw new Error('useSettings called from outside SettingsContext');
  }
  return context;
};

const changeName = (dispatch: SettingsDispatch, name: string): void =>
  dispatch((prev) => ({...prev, name}));

const changeAvatar = (dispatch: SettingsDispatch, avatarCode: number): void =>
  dispatch((prev) => ({...prev, avatar: avatarCode}));

const changePollInterval = (
  dispatch: SettingsDispatch,
  newPollIntervalSeconds: number
): void =>
  dispatch((prev) => ({
    ...prev,
    pollIntervalSeconds: newPollIntervalSeconds
  }));

export {
  SettingsProvider,
  useSettings,
  changeName,
  changeAvatar,
  changePollInterval
};
