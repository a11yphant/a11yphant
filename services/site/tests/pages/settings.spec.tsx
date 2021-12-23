import { render, screen } from "@testing-library/react";
import Settings from "app/pages/settings";

jest.mock("app/components/Navigation", () => ({
  __esModule: true,
  default: () => <></>,
}));

describe("settings", () => {
  it("renders the page", () => {
    render(<Settings />);

    expect(screen.getByRole("heading", { name: "Settings" })).toBeInTheDocument();
  });
});
