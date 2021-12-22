import { useFlashMessageApi } from "app/components/common/flashMessage/FlashMessageContext";
import React from "react";

export const FLASH_MESSAGE_PORTAL_ROOT_ID = "flash-message-portal";

export const FlashMessagePortalRoot = (): React.ReactElement => {
  const flashMessageApi = useFlashMessageApi();

  React.useEffect(() => {
    return () => {
      flashMessageApi.hide();
    };
  }, []);

  return <div id={FLASH_MESSAGE_PORTAL_ROOT_ID} />;
};
