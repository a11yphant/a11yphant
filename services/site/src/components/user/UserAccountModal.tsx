import { Modal } from "app/components/modal/Modal";
import { ModalContent } from "app/components/modal/ModalContent";
import { ModalTitle } from "app/components/modal/ModalTitle";
import clsx from "clsx";
import React from "react";

import { UserAccountBox } from "./UserAccountBox";
import { UserAccountModalTypes } from "./useUserAccountModalApi";

export interface UserAccountModalProps {
  open?: boolean;
  onClose?: () => void;
  mode: UserAccountModalTypes;
}

function getModalTitle(mode: UserAccountModalTypes): string {
  switch (mode) {
    case "signup":
      return "Sign up to save your progress!";
    case "login":
      return "Login";
    case "reset-password":
      return "Request a password reset";
  }
}

const UserAccountModal: React.FunctionComponent<UserAccountModalProps> = ({ open = false, onClose, mode }) => {
  return (
    <Modal
      className={clsx(
        "bg-primary",
        "flex flex-col",
        "p-5 min-w-fit max-w-xl",
        "xs:p-8",
        "md:px-12 md:py-10 md:min-w-[32rem] md:mx-auto",
        "lg:px-16 lg:py-14",
        "xl:px-20 xl:py-16",
      )}
      open={open}
      onClose={onClose}
    >
      <ModalTitle className={clsx("mb-8 max-w-52", "h4")}>{getModalTitle(mode)}</ModalTitle>
      <ModalContent>
        <UserAccountBox mode={mode} />
      </ModalContent>
    </Modal>
  );
};

export default UserAccountModal;
