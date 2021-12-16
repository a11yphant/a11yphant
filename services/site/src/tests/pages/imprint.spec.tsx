import { render } from "@testing-library/react";
import Imprint from "app/pages/imprint";

jest.mock("app/components/Navigation", () => ({
  __esModule: true,
  default: () => <></>,
}));

describe("imprint", () => {
  it("renders the page", () => {
    const { findByText } = render(<Imprint />);

    expect(findByText("Imprint")).toBeInTheDocument();
  });
});
