import { render, screen } from "@testing-library/react";
import Footer from "app/components/Footer";

describe("footer", () => {
  it("renders a footer", () => {
    render(<Footer />);

    // `<footer />` has the default role `contentinfo`
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("renders the footer navigation inside the footer", () => {
    render(<Footer />);

    expect(screen.getByLabelText("Footer")).toBeInTheDocument();
  });
});
