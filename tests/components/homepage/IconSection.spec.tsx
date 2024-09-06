import { MockedProvider } from "@apollo/client/testing";
import { render, screen } from "@testing-library/react";
import IconSection from "app/components/homepage/IconSection";

jest.mock("app/generated/graphql", () => ({
  useRegisterMutation: jest.fn().mockReturnValue([{}, {}]),
}));

describe("Icon Section", () => {
  it("renders one heading", () => {
    render(
      <MockedProvider>
        <IconSection />
      </MockedProvider>,
    );

    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(1);
  });
});
