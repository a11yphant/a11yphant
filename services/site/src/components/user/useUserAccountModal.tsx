import UserAccountModal from "app/components/user/UserAccountModal";
import React from "react";

interface UserAccountModalApi {
  show: (mode: "signup" | "login") => void;
  hide: () => void;
}

const UserAccountModalContext = React.createContext<UserAccountModalApi>({
  show: () => {
    throw new Error("showUserAccountModal is used outside of UserAccountModalProvider");
  },
  hide: () => {
    throw new Error("hideUserAccountModal is used outside of UserAccountModalProvider");
  },
});

export const UserAccountModalProvider: React.FunctionComponent = ({ children }) => {
  const [open, setOpen] = React.useState(false);
  const [mode, setMode] = React.useState<"signup" | "login">("signup");

  const showUserAccountModal = React.useCallback((mode: "signup" | "login") => {
    setMode(mode);
    setOpen(true);
  }, []);

  const hideUserAccountModal = React.useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <UserAccountModalContext.Provider
      value={{
        show: showUserAccountModal,
        hide: hideUserAccountModal,
      }}
    >
      {children}
      <UserAccountModal open={open} mode={mode} onClose={hideUserAccountModal} />
    </UserAccountModalContext.Provider>
  );
};

export const useUserAccountModalApi = (): UserAccountModalApi => {
  return React.useContext(UserAccountModalContext);
};
