import { render, screen } from "@testing-library/react";
import PrivacyPolicy from "app/pages/privacy-policy";

jest.mock("app/components/Navigation", () => ({
  __esModule: true,
  default: () => <></>,
}));

describe("privacy policy", () => {
  it("renders the page", () => {
    render(<PrivacyPolicy />);

    expect(screen.getByRole("heading", { name: "Privacy Policy" })).toBeInTheDocument();
  });
});
