"use client";

import { Transition } from "@headlessui/react";
import Button from "app/components/buttons/Button";
import ClosingX from "app/components/icons/ClosingX";
import { usePrefersReducedMotion } from "app/hooks/prefersReducedMotion";
import clsx from "clsx";
import React from "react";

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

export const FlashMessage: React.FC<React.PropsWithChildren<FlashMessageProps>> = ({
  children,
  show,
  onClose,
  type = FlashMessageType.STATUS,
  className,
  offsetElementClassName,
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
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
          className={clsx("w-full absolute py-2 px-2 bg-primary z-0 mt-24", "flex justify-center items-center", "md:mt-20", className)}
          role={type === FlashMessageType.ALERT ? "alert" : "status"}
          aria-live="assertive"
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
            aria-label="Close"
          >
            <ClosingX className={clsx("w-4 h-4")} />
          </Button>
        </div>
      </Transition>
      <Transition
        as="div"
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
    </>
  );
};
