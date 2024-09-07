"use client";

import { FlashMessage, FlashMessageProps } from "app/components/common/flashMessage/FlashMessage";
import React from "react";
import { createPortal } from "react-dom";

import FlashMessageTrigger from "./FlashMessageTrigger";

type UserDefinedFlashMessageProps = Omit<FlashMessageProps, "show" | "onClose">;

export interface FlashMessageApi {
  show: (message: React.ReactElement | string, props?: UserDefinedFlashMessageProps) => void;
  hide: () => void;
  portalRootRef: React.RefObject<HTMLDivElement>;
}

const FlashMessageContext = React.createContext<FlashMessageApi>({
  show: () => {
    throw new Error("flashMessageApi used outside FlashMessageContextProvider");
  },
  hide: () => {
    throw new Error("flashMessageApi used outside FlashMessageContextProvider");
  },
  portalRootRef: null,
});

export const FlashMessageContextProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [isShowing, setIsShowing] = React.useState<boolean>(false);
  const [message, setMessage] = React.useState<React.ReactNode>();
  const [props, setProps] = React.useState<UserDefinedFlashMessageProps>({});
  const portalRootRef = React.useRef<HTMLDivElement>(null);

  const closeFlashMessage = (): void => {
    setIsShowing(false);
  };

  const showFlashMessage = (message: React.ReactNode, props: UserDefinedFlashMessageProps): void => {
    setMessage(message);
    setProps(props);
    setIsShowing(true);
  };

  return (
    <FlashMessageContext.Provider
      value={{
        show: showFlashMessage,
        hide: closeFlashMessage,
        portalRootRef,
      }}
    >
      {children}
      {portalRootRef.current &&
        createPortal(
          <FlashMessage show={isShowing} onClose={closeFlashMessage} {...props}>
            {message}
          </FlashMessage>,
          portalRootRef.current,
        )}
      <FlashMessageTrigger />
    </FlashMessageContext.Provider>
  );
};

export const useFlashMessageApi = (): FlashMessageApi => {
  return React.useContext(FlashMessageContext);
};
