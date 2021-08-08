import {useEffect, useRef} from 'react';

type Callback = (count: number) => void;

export const useInterval = (callback: Callback, delay: number, isOn: boolean): void => {
  const savedCallback = useRef<Callback>();
  const countRef = useRef(0);
  const idRef = useRef(null);

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    if (isOn) {
      const tick = () => {
        savedCallback.current(++countRef.current);
      };
      if (delay !== null) {
        const id = setInterval(tick, delay || 5000);
        idRef.current = id;
        return () => clearInterval(id);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delay, isOn]); // in ms
};
