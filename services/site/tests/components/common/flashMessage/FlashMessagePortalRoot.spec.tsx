import { queryByAttribute, render } from "@testing-library/react";
import { FlashMessageContextProvider } from "app/components/common/flashMessage/FlashMessageContext";
import { FLASH_MESSAGE_PORTAL_ROOT_ID, FlashMessagePortalRoot } from "app/components/common/flashMessage/FlashMessagePortalRoot";

describe("FlashMessagePortalRoot", () => {
  it("renders div with id = FLASH_MESSAGE_PORTAL_ROOT_ID", () => {
    const { container } = render(<FlashMessagePortalRoot />, { wrapper: FlashMessageContextProvider });

    expect(queryByAttribute("id", container, FLASH_MESSAGE_PORTAL_ROOT_ID));
  });
});
