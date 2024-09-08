"use client";

import { FlashMessage, FlashMessageProps } from "app/components/common/flashMessage/FlashMessage";
import { useSearchParams } from "next/navigation";
import React from "react";
import { createPortal } from "react-dom";

import { FlashMessageEnum, getFlashMessage } from "./messages/getFlashMessage";

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
  const searchParams = useSearchParams();
  const fmType = searchParams.get("fm-type") as FlashMessageEnum | null;

  const closeFlashMessage = (): void => {
    setIsShowing(false);
  };

  const showFlashMessage = (message: React.ReactNode, props: UserDefinedFlashMessageProps): void => {
    setMessage(message);
    setProps(props);
    setIsShowing(true);
  };

  React.useEffect(() => {
    if (fmType) {
      const { message, type } = getFlashMessage(fmType);
      showFlashMessage(message, { type });
    }
  }, [fmType]);

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
    </FlashMessageContext.Provider>
  );
};

export const useFlashMessageApi = (): FlashMessageApi => {
  return React.useContext(FlashMessageContext);
};
