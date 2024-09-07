import { useFlashMessageApi } from "app/components/common/flashMessage/FlashMessageContext";
import React from "react";

export const FlashMessagePortalRoot = (): React.ReactElement => {
  const flashMessageApi = useFlashMessageApi();

  React.useEffect(() => {
    return () => {
      flashMessageApi.hide();
    };
  }, []);

  return <div ref={flashMessageApi.portalRootRef} />;
};
