import { MockedProvider } from "@apollo/client/testing";
import { render, screen } from "@testing-library/react";
import TopChallengeSection from "app/components/homepage/TopChallengeSection";

jest.mock("app/generated/graphql", () => ({
  useRegisterMutation: jest.fn().mockReturnValue([{}, {}]),
}));

describe("Top Challenge Section", () => {
  it("renders one heading", () => {
    render(
      <MockedProvider>
        <TopChallengeSection />
      </MockedProvider>,
    );

    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(1);
  });
});
