import React from "react";

// https://stackoverflow.com/questions/24613955/is-there-a-type-in-typescript-for-anything-except-functions#answer-48045023
type NoFunctionValue = boolean | string | number | null | undefined | NoFunctionObject | NoFunctionArray;
type NoFunctionObject = {
  [key: string]: NoFunctionValue;
};
type NoFunctionArray = Array<NoFunctionValue>;

export const useSessionState = <S extends NoFunctionValue = undefined>(
  key: string,
  initialValue?: S | (() => S),
): [S | undefined, React.Dispatch<React.SetStateAction<S | undefined>>] => {
  const [state, setState] = React.useState<S>();

  React.useEffect(() => {
    const item = sessionStorage.getItem(key);

    if (item) {
      setState(JSON.parse(item) as S);
      return;
    }

    if (initialValue) {
      setState(initialValue instanceof Function ? initialValue() : initialValue);
      return;
    }

    setState(undefined);
  }, []);

  React.useEffect(() => {
    if (state) {
      const serializedState = JSON.stringify(state);
      sessionStorage.setItem(key, serializedState);
    } else {
      sessionStorage.removeItem(key);
    }
  }, [key, state]);

  return [state, setState];
};
