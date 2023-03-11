import { render, screen } from "@testing-library/react";
import LegalNotice from "app/pages/legal-notice";

jest.mock("app/components/Navigation", () => ({
  __esModule: true,
  default: () => <></>,
}));

describe("legal-notice", () => {
  it("renders the page", () => {
    render(<LegalNotice />);

    expect(screen.getByRole("heading", { name: "Legal Notice" })).toBeInTheDocument();
  });
});
