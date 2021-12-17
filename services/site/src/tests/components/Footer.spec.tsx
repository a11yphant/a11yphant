import { render, screen } from "@testing-library/react";
import Footer from "app/components/Footer";

describe("footer", () => {
  it("renders a footer", () => {
    render(<Footer />);

    // `<footer />` has the default role `contentinfo`
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("renders a navigation inside the footer", () => {
    render(<Footer />);

    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });
});
