import "@testing-library/jest-dom/extend-expect";

import { cleanup, render } from "@testing-library/react";
import Hero from "app/components/homepage/Hero";

afterEach(cleanup);

describe("Hero", () => {
  it("has two level two headings", async () => {
    const root = render(<Hero />);

    expect(await root.findAllByRole("heading", { level: 2 })).toHaveLength(2);
  });

  it("has a link to challenges", async () => {
    const root = render(<Hero />);

    expect(await root.findByText("Start Coding")).toHaveAttribute("href", "/#challenges");
  });

  it("has a link to challenges", async () => {
    const root = render(<Hero />);

    expect(await root.findByText("Sign Up via Github")).toHaveProperty("href", "http://localhost/auth/github");
  });
});
