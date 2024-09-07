"use client";

import { useSearchParams } from "next/navigation";
import React from "react";

import { useFlashMessageApi } from "./FlashMessageContext";
import { getFlashMessage } from "./messages/getFlashMessage";

const FlashMessageTrigger: React.FunctionComponent = () => {
  const flashMessageApi = useFlashMessageApi();
  const searchParams = useSearchParams();
  const fmType = searchParams.get("fm-type");

  React.useEffect(() => {
    if (fmType) {
      const { message, type } = getFlashMessage(fmType);
      flashMessageApi.show(message, { type });
    }
  }, [fmType]);

  return null;
};

export default FlashMessageTrigger;
