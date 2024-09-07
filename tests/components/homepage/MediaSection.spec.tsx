import { MockedProvider } from "@apollo/client/testing";
import { render, screen } from "@testing-library/react";
import MediaSection from "app/components/homepage/MediaSection";

jest.mock("app/generated/graphql", () => ({
  useRegisterMutation: jest.fn().mockReturnValue([{}, {}]),
}));

describe("Media Section", () => {
  it("renders one heading", () => {
    render(
      <MockedProvider>
        <MediaSection />
      </MockedProvider>,
    );

    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(1);
  });
});
