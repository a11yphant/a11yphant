import Button from "app/components/buttons/Button";
import X from "app/components/icons/X";
import clsx from "clsx";
import React from "react";

interface ConfirmationModalProps {
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
    <div className={clsx("z-10 inset-0 overflow-y-auto", "flex justify-center items-center", open ? "fixed" : "hidden")}>
      <div className={clsx("relative", "w-1/2 h-64 bg-backgroundMiddle rounded-lg shadow-xl", "px-12 py-14")}>
        <Button onClick={onCancel} overrideClassname className="absolute top-6 right-6">
          <span className="sr-only">Close</span>
          <X />
        </Button>

        <h2 className={clsx("text-2xl")}>{title}</h2>

        <div className="absolute bottom-7 right-7">
          <Button onClick={onCancel} overrideClassname className="mr-16">
            {cancelButtonLabel ?? "Cancel"}
          </Button>
          <Button onClick={onConfirm} full className="leading-4 px-6 py-4">
            {confirmButtonLabel ?? "Confirm"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
