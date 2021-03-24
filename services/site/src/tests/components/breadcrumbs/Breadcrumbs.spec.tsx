import "@testing-library/jest-dom/extend-expect";

import { cleanup, render, screen } from "@testing-library/react";
import Breadcrumbs from "app/components/breadcrumbs/Breadcrumbs";

afterEach(cleanup);

describe("Breadcrumbs", () => {
  it("renders correctly", () => {
    const breadcrumbHome = {
      href: "/",
      children: <span>Home</span>,
    };

    const breadcrumbChallenge = {
      href: "/challenge",
      children: "Challenge",
      className: "abc",
    };

    const { container } = render(<Breadcrumbs breadcrumbs={[breadcrumbHome, breadcrumbChallenge]} />);

    expect(screen.queryByRole("navigation")).toBeTruthy();
    expect(screen.queryByRole("list")).toBeTruthy();
    expect(container.querySelectorAll("li")).toHaveProperty("length", 2);
    // Test for Slash
    expect(container.querySelectorAll("svg")).toHaveProperty("length", 1);

    // Breadcrumb Home
    expect(container.querySelectorAll("span")).toHaveProperty("length", 1);
    expect(screen.getByText("Home").closest("a")).toHaveAttribute("href", breadcrumbHome.href);

    // Breadcrumb Challenge
    expect(screen.getByText("Challenge").closest("a")).toHaveAttribute("href", breadcrumbChallenge.href);
    expect(screen.getByText("Challenge").closest("a").classList.contains(breadcrumbChallenge.className)).toBeTruthy();
  });
});
