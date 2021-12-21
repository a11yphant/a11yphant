import { queryByAttribute, render } from "@testing-library/react";
import { FLASH_MESSAGE_PORTAL_ROOT_ID, FlashMessagePortalRoot } from "app/components/common/flashMessage/FlashMessagePortalRoot";

describe("FlashMessagePortalRoot", () => {
  it("renders div with id = FLASH_MESSAGE_PORTAL_ROOT_ID", () => {
    const { container } = render(<FlashMessagePortalRoot />);

    expect(queryByAttribute("id", container, FLASH_MESSAGE_PORTAL_ROOT_ID));
  });
});
