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
  it("renders the wrapper element", () => {
    const wrapper = shallow(<Custom404 />);

    expect(wrapper.find("main").length).toBe(1);
  });

  it("renders a heading", () => {
    const wrapper = shallow(<Custom404 />);

    expect(wrapper.find("h1").length).toBe(1);
    expect(wrapper.find("h1").text()).toBe(mockHeading);
  });

  it("renders a description text", () => {
    const wrapper = shallow(<Custom404 />);

    expect(wrapper.find("p").length).toBe(1);
    expect(wrapper.find("p").text()).toBe(mockText);
  });

  it("renders a link", () => {
    const wrapper = shallow(<Custom404 />);

    expect(wrapper.find(Link).length).toBe(1);
  });

  it("renders the illustration SVG", () => {
    const wrapper = shallow(<Custom404 />);

    expect(wrapper.find(IllustrationLostSpace).length).toBe(1);
  });
});
