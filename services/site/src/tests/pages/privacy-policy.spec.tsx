import { cleanup, render } from "@testing-library/react";
import PrivacyPolicy from "app/pages/privacy-policy";

afterEach(cleanup);

jest.mock("app/components/Navigation", () => ({
  __esModule: true,
  default: () => <></>,
}));

describe("privacy policy", () => {
  it("renders the page", () => {
    const { findByText } = render(<PrivacyPolicy />);

    expect(findByText("Privacy Policy")).toBeTruthy();
  });
});
