import { MockedProvider } from "@apollo/client/testing";
import { render, screen } from "@testing-library/react";
import HeroSection from "app/components/homepage/HeroSection";

jest.mock("app/generated/graphql", () => ({
  useRegisterMutation: jest.fn().mockReturnValue([{}, {}]),
}));

describe("Hero Section", () => {
  it("renders two headings", () => {
    render(
      <MockedProvider>
        <HeroSection />
      </MockedProvider>,
    );

    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(2);
    expect(screen.getByRole("heading", { level: 2, name: /Sign up/ }));
  });

  it("renders a UserAccountBox", () => {
    render(<HeroSection />);

    expect(screen.getByRole("heading", { level: 2, name: "Sign up to save your progress!" })).toBeInTheDocument();
  });
});
