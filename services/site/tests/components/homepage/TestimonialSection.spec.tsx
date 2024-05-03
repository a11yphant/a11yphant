import { MockedProvider } from "@apollo/client/testing";
import { render, screen } from "@testing-library/react";
import TestimonialSection from "app/components/homepage/TestimonialSection";

jest.mock("app/generated/graphql", () => ({
  useRegisterMutation: jest.fn().mockReturnValue([{}, {}]),
}));

describe("Testimonial Section", () => {
  it("renders one heading", () => {
    render(
      <MockedProvider>
        <TestimonialSection />
      </MockedProvider>,
    );

    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(1);
  });
});
