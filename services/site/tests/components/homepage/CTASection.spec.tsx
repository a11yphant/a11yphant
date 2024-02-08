import { MockedProvider } from "@apollo/client/testing";
import { render, screen } from "@testing-library/react";
import CTASection from "app/components/homepage/CTASection";

jest.mock("app/generated/graphql", () => ({
  useRegisterMutation: jest.fn().mockReturnValue([{}, {}]),
}));

describe("CTA Section", () => {
  it("renders one heading", () => {
    render(
      <MockedProvider>
        <CTASection />
      </MockedProvider>,
    );

    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(1);
  });
});
