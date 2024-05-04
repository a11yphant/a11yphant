import { render, screen } from "@testing-library/react";
import QuoteCard from "app/components/homepage/QuoteCard";

jest.mock("app/generated/graphql", () => ({
  useRegisterMutation: jest.fn().mockReturnValue([{}, {}]),
}));

describe("Quote Card", () => {
  it("renders a footer within the blockquote", () => {
    render(<QuoteCard quote="It's outstanding." author="a11yphant" url="https://twitter.com" />);

    // `<footer />` has the default role `contentinfo`
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });
});
