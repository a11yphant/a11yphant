import { FlashMessage, FlashMessageProps } from "app/components/common/flashMessage/FlashMessage";
import React from "react";

type UserDefinedFlashMessageProps = Omit<FlashMessageProps, "show" | "onClose">;

export interface FlashMessageApi {
  show: (message: React.ReactElement | string, props?: UserDefinedFlashMessageProps) => void;
  hide: () => void;
}

const FlashMessageContext = React.createContext<FlashMessageApi>({
  show: () => {
    throw new Error("flashMessageApi used outside FlashMessageContextProvider");
  },
  hide: () => {
    throw new Error("flashMessageApi used outside FlashMessageContextProvider");
  },
});

export const FlashMessageContextProvider: React.FunctionComponent = ({ children }) => {
  const [isShowing, setIsShowing] = React.useState<boolean>(false);
  const [message, setMessage] = React.useState<React.ReactNode>();
  const [props, setProps] = React.useState<UserDefinedFlashMessageProps>({});

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
      }}
    >
      {children}
      <FlashMessage show={isShowing} onClose={closeFlashMessage} {...props}>
        {message}
      </FlashMessage>
    </FlashMessageContext.Provider>
  );
};

export const useFlashMessageApi = (): FlashMessageApi => {
  return React.useContext(FlashMessageContext);
};
