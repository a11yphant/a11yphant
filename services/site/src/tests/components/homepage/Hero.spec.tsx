import "@testing-library/jest-dom/extend-expect";

import { cleanup, render } from "@testing-library/react";
import Hero from "app/components/homepage/Hero";

afterEach(cleanup);

describe("Hero", () => {
  it("renders wrapper element", () => {
    const { container } = render(<Hero />);

    expect(container.firstChild).toBeTruthy();
  });
  it("renders two headings", async () => {
    const root = render(<Hero />);

    expect(await root.findAllByRole("heading", { level: 2 })).toHaveLength(2);
  });

  it("renders a link for the github sign up", async () => {
    const root = render(<Hero />);

    expect(await root.findByText("Sign up via Github")).toHaveProperty("href", "http://localhost/auth/github");
  });
});
