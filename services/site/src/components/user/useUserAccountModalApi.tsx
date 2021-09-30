import React from "react";

interface UserAccountModalApi {
  show: (mode: "signup" | "login") => void;
  hide: () => void;
}

export const UserAccountModalContext = React.createContext<UserAccountModalApi>({
  show: () => {
    throw new Error("userAccountModalApi.show is used outside of UserAccountModalProvider");
  },
  hide: () => {
    throw new Error("userAccountModalApi.hide is used outside of UserAccountModalProvider");
  },
});

export const useUserAccountModalApi = (): UserAccountModalApi => {
  return React.useContext(UserAccountModalContext);
};
