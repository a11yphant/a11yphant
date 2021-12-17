import { render, screen } from "@testing-library/react";
import Imprint from "app/pages/imprint";

jest.mock("app/components/Navigation", () => ({
  __esModule: true,
  default: () => <></>,
}));

describe("imprint", () => {
  it("renders the page", () => {
    render(<Imprint />);

    expect(screen.getByRole("heading", { name: "Imprint" })).toBeInTheDocument();
  });
});
