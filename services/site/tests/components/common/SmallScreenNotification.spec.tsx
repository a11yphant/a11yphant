import { render } from "@testing-library/react";
import SmallScreenNotification from "app/components/common/SmallScreenNotification";

describe("Small Screen Notification", () => {
  it("renders without failing", () => {
    expect(() => render(<SmallScreenNotification />)).not.toThrow();
  });
});
