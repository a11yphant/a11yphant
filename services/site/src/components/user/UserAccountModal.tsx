import { Dialog, Transition } from "@headlessui/react";
import clsx from "clsx";
import React from "react";

import Button from "../buttons/Button";
import X from "../icons/X";
import { UserAccountBox } from "./UserAccountBox";

export interface UserAccountModalProps {
  open?: boolean;
  onClose?: () => void;
  mode: "signup" | "login";
}

const UserAccountModal: React.FunctionComponent<UserAccountModalProps> = ({ open = false, onClose, mode }) => {
  return (
    <Transition
      show={open}
      enter="transition duration-100 ease-out"
      enterFrom="transform scale-95 opacity-0"
      enterTo="transform scale-100 opacity-100"
      leave="transition duration-75 ease-out"
      leaveFrom="transform scale-100 opacity-100"
      leaveTo="transform scale-95 opacity-0"
    >
      <Dialog open={open} onClose={onClose} className={clsx("fixed z-10 inset-0 overflow-y-auto h-screen flex items-center justify-center")}>
        <div
          className={clsx(
            "p-8 bg-primary rounded-lg min-w-max max-w-xl flex flex-col relative",
            "md:px-12 md:py-10 md:min-w-[32rem] md:mx-auto",
            "lg:px-16 lg:py-14",
            "xl:px-20 xl:py-16",
          )}
        >
          <Dialog.Overlay className="fixed inset-0 bg-background opacity-25 z-[-1]" />

          <Button
            onClick={() => onClose()}
            overrideClassName
            className={clsx(
              "w-11 h-11 p-3.5 absolute top-4 right-4",
              "transition-colors duration-300",
              "hover:text-primary-light",
              "focus-visible:text-primary-light",
            )}
          >
            <span className="sr-only">Close</span>
            <X />
          </Button>

          <Dialog.Title className={clsx("mb-8", "h4")}>{mode === "signup" ? "Sign up to save your progress!" : "Login"}</Dialog.Title>

          <UserAccountBox mode={mode} />
        </div>
      </Dialog>
    </Transition>
  );
};

export default UserAccountModal;
