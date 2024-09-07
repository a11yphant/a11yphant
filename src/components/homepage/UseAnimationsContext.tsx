"use client";

import React from "react";

interface UseAnimationsContextInterface {
  animationsEnabled: boolean;
  toggleAnimations: () => void;
}

const UseAnimationsContext = React.createContext<UseAnimationsContextInterface>({
  animationsEnabled: true,
  toggleAnimations: () => {
    throw new Error("UseAnimationsContext is used outside the UseAnimationsContextProvider");
  },
});

export function UseAnimationsContextProvider({ children }: { children: React.ReactElement }): React.ReactElement {
  const [animationsEnabled, setAnimationsEnabled] = React.useState(true);
  return (
    <UseAnimationsContext.Provider
      value={{
        animationsEnabled,
        toggleAnimations: () => setAnimationsEnabled((prev) => !prev),
      }}
    >
      {children}
    </UseAnimationsContext.Provider>
  );
}

export function useAnimationsContext(): UseAnimationsContextInterface {
  return React.useContext(UseAnimationsContext);
}
