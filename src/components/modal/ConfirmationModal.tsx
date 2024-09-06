import Button from "app/components/buttons/Button";
import { ModalActions } from "app/components/modal/ModalActions";
import { ModalTitle } from "app/components/modal/ModalTitle";
import clsx from "clsx";
import React from "react";

import { Modal } from "./Modal";

export interface ConfirmationModalProps {
  open?: boolean;
  title: string;
  cancelButtonLabel?: string;
  onCancel: () => void;
  confirmButtonLabel?: string;
  onConfirm?: () => void;
}

const ConfirmationModal: React.FunctionComponent<ConfirmationModalProps> = ({
  open = false,
  title,
  cancelButtonLabel,
  onCancel,
  confirmButtonLabel,
  onConfirm,
}) => {
  return (
    <Modal open={open} onClose={onCancel} className={clsx("px-12 py-14 w-full mx-4 md:w-1/2 max-w-2xl h-64 bg-background-light")}>
      <ModalTitle className={clsx("text-2xl")}>{title}</ModalTitle>
      <ModalActions>
        <Button
          onClick={onCancel}
          overrideClassName
          className={clsx(
            "mr-16 border-b-2 border-transparent",
            "transition-colors duration-300",
            "hover:text-primary-light hover:border-primary-light",
            "focus-rounded-instead-of-underline",
          )}
        >
          {cancelButtonLabel ?? "Cancel"}
        </Button>
        <Button onClick={onConfirm} primary className={clsx("px-6 py-2.5")}>
          {confirmButtonLabel ?? "Confirm"}
        </Button>
      </ModalActions>
    </Modal>
  );
};

export default ConfirmationModal;
