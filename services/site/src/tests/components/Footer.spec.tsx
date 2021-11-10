import { cleanup, render } from "@testing-library/react";
import Footer from "app/components/Footer";

afterEach(cleanup);

describe("footer", () => {
  it("renders a footer", () => {
    const { container } = render(<Footer />);

    expect(container.querySelector("footer")).toBeTruthy();
  });

  it("renders a navigation inside the footer", () => {
    const { container } = render(<Footer />);

    expect(container.querySelector("footer nav")).toBeTruthy();
  });
});
