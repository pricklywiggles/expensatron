import * as React from 'react';

const useDebouncedState = <T extends unknown>(
  value: T,
  delayInMs: number
): [T, React.Dispatch<React.SetStateAction<T>>] => {
  // State and setters for debounced value
  const [state, setState] = React.useState<T>(value);
  const [debouncedState, setDebouncedState] = React.useState<T>(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedState(state);
    }, delayInMs);
    return () => {
      clearTimeout(handler);
    };
  }, [state, delayInMs]);

  return [debouncedState, setState];
};

export {useDebouncedState};
