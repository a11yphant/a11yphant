import "@testing-library/jest-dom/extend-expect";

import { MockedProvider } from "@apollo/client/testing";
import { render, screen } from "@testing-library/react";
import Hero from "app/components/homepage/Hero";

jest.mock("app/generated/graphql", () => ({
  useRegisterMutation: jest.fn().mockReturnValue([{}, {}]),
}));

describe("Hero", () => {
  it("renders two headings", () => {
    render(
      <MockedProvider>
        <Hero />
      </MockedProvider>,
    );

    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(2);
    expect(screen.getByRole("heading", { level: 2, name: /Sign up/ }));
  });

  it("renders a UserAccountBox", () => {
    render(<Hero />);

    expect(screen.getByRole("heading", { level: 2, name: "Sign up to save your progress!" })).toBeInTheDocument();
  });
});
