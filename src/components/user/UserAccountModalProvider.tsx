import UserAccountModal from "app/components/user/UserAccountModal";
import React from "react";

import { UserAccountModalContext } from "./useUserAccountModalApi";

export const UserAccountModalProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
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
