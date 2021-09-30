import { Modal, ModalContent, ModalTitle } from "app/components/modal/Modal";
import clsx from "clsx";
import React from "react";

import { UserAccountBox } from "./UserAccountBox";

export interface UserAccountModalProps {
  open?: boolean;
  onClose?: () => void;
  mode: "signup" | "login";
}

const UserAccountModal: React.FunctionComponent<UserAccountModalProps> = ({ open = false, onClose, mode }) => {
  return (
    <Modal className="bg-primary" open={open} onClose={onClose}>
      <ModalTitle className={clsx("mb-8", "h4")}>{mode === "signup" ? "Sign up to save your progress!" : "Login"}</ModalTitle>
      <ModalContent>
        <UserAccountBox mode={mode} />
      </ModalContent>
    </Modal>
  );
};

export default UserAccountModal;
