import "@testing-library/jest-dom/extend-expect";

import { render, screen } from "@testing-library/react";
import Hero from "app/components/homepage/Hero";
import { UserAccountBox } from "app/components/user/UserAccountBox";
import { shallow } from "enzyme";

describe("Hero", () => {
  it("renders two headings", () => {
    render(<Hero />);

    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(2);
    expect(screen.getByRole("heading", { level: 2, name: /Sign up/ }));
  });

  it("renders a UserAccountBox", () => {
    const view = shallow(<Hero />);

    expect(view.exists(UserAccountBox)).toBeTruthy();
  });
});
