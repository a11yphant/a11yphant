import Button from "app/components/buttons/Button";
import X from "app/components/icons/X";
import clsx from "clsx";
import React from "react";

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
  const handleEscapeClick = (event: KeyboardEvent): void => {
    if (event.key === "Escape") {
      onCancel();
    }
  };

  React.useEffect(() => {
    document.addEventListener("keydown", handleEscapeClick);

    return () => {
      document.removeEventListener("keydown", handleEscapeClick);
    };
  }, []);

  return (
    <div
      onClick={onCancel}
      className={clsx("z-10 inset-0 overflow-y-auto", "bg-greyDark bg-opacity-50", "flex justify-center items-center", open ? "fixed" : "hidden")}
      aria-hidden
    >
      <div className={clsx("relative", "w-1/2 h-64 bg-backgroundMiddle rounded-lg shadow-modal", "px-12 py-14")}>
        <Button
          onClick={onCancel}
          overrideClassName
          className={clsx("absolute top-6 right-6", "transition-colors duration-300", "hover:text-primaryLight  focus:text-primaryLight")}
        >
          <span className="sr-only">Close</span>
          <X />
        </Button>

        <h2 className={clsx("text-2xl")}>{title}</h2>

        <div className="absolute bottom-7 right-7">
          <Button
            onClick={onCancel}
            overrideClassName
            className={clsx(
              "mr-16 border-b-2 border-transparent",
              "transition-colors duration-300",
              "hover:text-primaryLight hover:border-primaryLight focus:text-primaryLight focus:border-primaryLight",
            )}
          >
            {cancelButtonLabel ?? "Cancel"}
          </Button>
          <Button onClick={onConfirm} primary className="leading-4 px-6 py-4">
            {confirmButtonLabel ?? "Confirm"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
