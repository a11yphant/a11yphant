import "@testing-library/jest-dom/extend-expect";

import { cleanup } from "@testing-library/react";
import IllustrationLostSpace from "app/components/icons/IllustrationLostSpace";
import Custom404 from "app/pages/404";
import { shallow } from "enzyme";
import Link from "next/link";
import React from "react";

afterEach(cleanup);

const mockHeading = "Error 404";
const mockText = "seems like you got lost in space";

describe("404 Page", () => {
  it("renders wrapper elements", () => {
    const wrapper = shallow(<Custom404 />);

    expect(wrapper.find("main").length).toBe(1);
    expect(wrapper.find("section").length).toBe(1);
  });

  it("renders heading", () => {
    const wrapper = shallow(<Custom404 />);

    expect(wrapper.find("h2").length).toBe(1);
    expect(wrapper.find("h2").text()).toBe(mockHeading);
  });

  it("renders description text", () => {
    const wrapper = shallow(<Custom404 />);

    expect(wrapper.find("p").length).toBe(1);
    expect(wrapper.find("p").text()).toBe(mockText);
  });

  it("renders link", () => {
    const wrapper = shallow(<Custom404 />);

    expect(wrapper.find(Link).length).toBe(1);
  });

  it("renders illustration", () => {
    const wrapper = shallow(<Custom404 />);

    expect(wrapper.find(IllustrationLostSpace).length).toBe(1);
  });
});
