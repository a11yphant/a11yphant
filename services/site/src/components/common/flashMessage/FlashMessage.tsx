import { Transition } from "@headlessui/react";
import Button from "app/components/buttons/Button";
import { FLASH_MESSAGE_PORTAL_ROOT_ID } from "app/components/common/flashMessage/FlashMessagePortalRoot";
import X from "app/components/icons/X";
import { usePrefersReducedMotion } from "app/hooks/prefersReducedMotion";
import clsx from "clsx";
import React from "react";
import ReactDOM from "react-dom";

export enum FlashMessageType {
  STATUS = "status",
  ALERT = "alert",
}

export interface FlashMessageProps {
  show: boolean;
  onClose: () => void;
  type?: FlashMessageType;
  className?: string;
  offsetElementClassName?: string;
}

export const FlashMessage: React.FunctionComponent<FlashMessageProps> = ({
  children,
  show,
  onClose,
  type = FlashMessageType.STATUS,
  className,
  offsetElementClassName,
}) => {
  const [rootNode, setRootNode] = React.useState<HTMLElement>();
  const prefersReducedMotion = usePrefersReducedMotion();

  React.useEffect(() => {
    const rootNode = document.getElementById(FLASH_MESSAGE_PORTAL_ROOT_ID);

    if (show && !rootNode) {
      console.error("Can't show FlashMessage: No FlashMessagePortalRoot defined in current scope");
    }

    setRootNode(rootNode);
  }, [show]);

  if (!rootNode) {
    return <></>;
  }

  return ReactDOM.createPortal(
    <>
      <Transition
        appear={true}
        show={show}
        as={React.Fragment}
        enter={prefersReducedMotion ? "" : "transition duration-500 ease-in-out delay-500"}
        enterFrom="-translate-y-[3.75rem]"
        enterTo="translate-y-0"
        leave={prefersReducedMotion ? "" : "transition duration-500 ease-in-out"}
        leaveFrom="translate-y-0"
        leaveTo="-translate-y-[3.75rem]"
      >
        <div
          className={clsx("w-full absolute py-2 px-2 bg-primary z-0", "flex justify-center items-center", className)}
          role={type === FlashMessageType.ALERT ? "alert" : "status"}
        >
          <span className={clsx("basis-12 flex-shrink hidden", "md:block")} />
          <div className={clsx("flex justify-center pr-4 pl-9 text-left", "md:text-center")}>{children}</div>
          <Button
            onClick={onClose}
            overrideClassName
            className={clsx(
              "flex justify-center basis-12 shrink-0 grow-0 p-3.5 rounded z-10",
              "transition ease-in-out duration-300",
              "hover:text-light",
              "motion-safe:hover:scale-125 motion-reduce:hover:outline-light motion-reduce:hover:outline-2 motion-reduce:hover:outline",
              "focus:text-light",
            )}
          >
            <span className={clsx("sr-only")}>Close</span>
            <X className={clsx("w-4 h-4")} />
          </Button>
        </div>
      </Transition>
      <Transition
        appear={true}
        show={show}
        enter={prefersReducedMotion ? "" : "transition-[height] duration-500 ease-in-out delay-500"}
        enterFrom="h-0"
        enterTo="h-[4.5rem]"
        leave={prefersReducedMotion ? "" : "transition-[height] duration-500 ease-in-out"}
        leaveFrom="h-[4.5rem]"
        leaveTo="h-0"
      >
        <div className={clsx("h-[4.5rem]", offsetElementClassName)} />
      </Transition>
    </>,
    rootNode,
  );
};
