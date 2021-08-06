import * as React from 'react';

const serialize = JSON.stringify;
const deserialize = JSON.parse;

// peristent store, for now it's localstorage. Deals with SSR state as well.
const store = {
  getItem: (key: string) => {
    if (typeof window !== 'undefined') {
      return window.localStorage.getItem(key);
    }
    console.error('Attempted to get localStorage while on server');
    return null;
  },
  setItem: (key: string, value: string) => {
    if (typeof window !== 'undefined') {
      return window.localStorage.setItem(key, value);
    }
    console.error('Attempted to set localStorage while on server');
    return null;
  }
};

/**
 * React.useState, but for localStorage.
 *
 * @param key The key to set in localStorage for this value
 * @param defaultValue The value to use if it is not already in localStorage
 * @param {{serialize: Function, deserialize: Function}} options The serialize and deserialize functions to use (defaults to JSON.stringify and JSON.parse respectively)
 */
const useLocalStorageState = (
  key: string,
  defaultValue = ''
): [unknown, React.Dispatch<unknown>] => {
  const [state, setState] = React.useState<unknown>(() => {
    // During SSR, we keep the default value
    const value = store.getItem(key);
    if (value) {
      return deserialize(value);
    }
    return defaultValue;
  });
  React.useDebugValue(`${key}: ${serialize(state)}`);

  React.useEffect(() => {
    store.setItem(key, serialize(state));
  }, [key, state]);

  return [state, setState];
};

export {useLocalStorageState};
