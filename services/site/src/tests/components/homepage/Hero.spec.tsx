import "@testing-library/jest-dom/extend-expect";

import { MockedProvider } from "@apollo/client/testing";
import { render, screen } from "@testing-library/react";
import Hero from "app/components/homepage/Hero";

function renderHero(): ReturnType<typeof render> {
  return render(
    <MockedProvider>
      <Hero />
    </MockedProvider>,
  );
}

describe("Hero", () => {
  it("renders wrapper element", () => {
    const { container } = renderHero();

    expect(container.firstChild).toBeTruthy();
  });
  it("renders two headings", async () => {
    renderHero();

    expect(await screen.findAllByRole("heading", { level: 2 })).toHaveLength(2);
  });

  it("renders a link for the github sign up", async () => {
    renderHero();

    expect(await screen.findByText("Sign up via Github")).toHaveProperty("href", "http://localhost/auth/github");
  });
});
