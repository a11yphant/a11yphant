"use client";

import React, { SetStateAction } from "react";

// https://stackoverflow.com/questions/24613955/is-there-a-type-in-typescript-for-anything-except-functions#answer-48045023
type NoFunctionValue = boolean | string | number | null | undefined | NoFunctionObject | NoFunctionArray;
type NoFunctionObject = {
  [key: string]: NoFunctionValue;
};
type NoFunctionArray = Array<NoFunctionValue>;

export const useSessionState = <S extends NoFunctionValue = undefined>(key: string, initialValue?: S): [S, React.Dispatch<SetStateAction<S>>] => {
  if (typeof window === "undefined") {
    throw new Error("useSessionState must be used in a browser environment");
  }

  // Retrieve the stored value from sessionStorage (or use the initial value)
  const getStoredValue = (): S => {
    const storedValue = window.sessionStorage.getItem(key);
    return storedValue !== null ? JSON.parse(storedValue) : initialValue;
  };

  // Initialize state with the stored value or the initial value
  const [value, setValue] = React.useState(getStoredValue);

  // Sync with sessionStorage whenever the value changes
  React.useEffect(() => {
    if (value !== undefined) {
      window.sessionStorage.setItem(key, JSON.stringify(value));
    }
  }, [key, value]);

  return [value, setValue];
};
