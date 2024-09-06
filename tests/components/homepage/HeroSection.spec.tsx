import { MockedProvider } from "@apollo/client/testing";
import { render, screen } from "@testing-library/react";
import HeroSection from "app/components/homepage/HeroSection";

jest.mock("app/generated/graphql", () => ({
  useRegisterMutation: jest.fn().mockReturnValue([{}, {}]),
}));

describe("Hero Section", () => {
  it("renders one heading", () => {
    render(
      <MockedProvider>
        <HeroSection />
      </MockedProvider>,
    );

    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  });
});
