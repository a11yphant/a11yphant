import Exclamation from "app/components/icons/Exclamation";
import X from "app/components/icons/X";
import React from "react";

interface ConfirmationModalProps {
  open?: boolean;
  title: string;
  content?: React.ReactNode;
  cancelButtonLabel?: string;
  onCancel: () => void;
  confirmButtonLabel?: string;
  onConfirm?: () => void;
  // Override default buttons
  overrideButtons?: React.ReactNode;
}

// https://tailwindui.com/components/application-ui/overlays/modals#component-6a0b582f00c5ec38bf748d9a75559f04

const ConfirmationModal: React.FunctionComponent<ConfirmationModalProps> = ({
  open = false,
  title,
  content,
  cancelButtonLabel,
  onCancel,
  confirmButtonLabel,
  onConfirm,
  overrideButtons,
}) => {
  return (
    <div className={`${open ? "fixed" : "hidden"} z-10 inset-0 overflow-y-auto`}>
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/*Background overlay, show/hide based on modal state.*/}

        {/*Entering: "ease-out duration-300"*/}
        {/*  From: "opacity-0"*/}
        {/*  To: "opacity-100"*/}
        {/*Leaving: "ease-in duration-200"*/}
        {/*  From: "opacity-100"*/}
        {/*  To: "opacity-0"*/}
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        {/*This element is to trick the browser into centering the modal contents. */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>

        {/*Modal panel, show/hide based on modal state.*/}

        {/*Entering: "ease-out duration-300"*/}
        {/*  From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"*/}
        {/*  To: "opacity-100 translate-y-0 sm:scale-100"*/}
        {/*Leaving: "ease-in duration-200"*/}
        {/*  From: "opacity-100 translate-y-0 sm:scale-100"*/}
        {/*  To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"*/}

        <div
          className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <div className="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
            <button
              onClick={onCancel}
              type="button"
              className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <span className="sr-only">Close</span>
              <X />
            </button>
          </div>
          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-primaryLight bg-opacity-50 sm:mx-0 sm:h-10 sm:w-10">
              <Exclamation />
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                {title}
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">{content}</p>
              </div>
            </div>
          </div>
          <div className="mt-5 sm:mt-4 sm:flex sm:justify-end">
            {overrideButtons ? (
              overrideButtons
            ) : (
              <>
                <button
                  onClick={onCancel}
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  {cancelButtonLabel ?? "Cancel"}
                </button>
                <button
                  onClick={onConfirm}
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {confirmButtonLabel ?? "Confirm"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
