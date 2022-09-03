import { useState, useEffect, useId } from "react";

export default function useStoredState<T>(fallbackInitState: T) {
  const uniqueKey = useId();
  const [data, setData] = useState<T>(() => {
    let initialState: T;
    try {
      const _stringValue = localStorage.getItem(uniqueKey);
      if (_stringValue == null) {
        throw Error();
      }
      initialState = JSON.parse(_stringValue);
    } catch (err) {
      initialState = fallbackInitState;
    }
    return initialState;
  });

  useEffect(() => {
    localStorage.setItem(uniqueKey, JSON.stringify(data));
  }, [data, uniqueKey]);

  return [data, setData] as const;
}
