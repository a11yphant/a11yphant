import "@testing-library/jest-dom/extend-expect";

import { cleanup } from "@testing-library/react";
import IllustrationLost from "app/components/icons/IllustrationLost";
import CustomError from "app/pages/_error";
import { shallow } from "enzyme";
import Link from "next/link";
import React from "react";

afterEach(cleanup);

const mockHeading = "Error 500";
const mockText = "ooops, something went wrong";

describe("Error Page", () => {
  it("renders wrapper elements", () => {
    const wrapper = shallow(<CustomError statusCode={500} />);

    expect(wrapper.find("main").length).toBe(1);
    expect(wrapper.find("section").length).toBe(1);
  });

  it("renders heading with status code", () => {
    const wrapper = shallow(<CustomError statusCode={500} />);

    expect(wrapper.find("h2").length).toBe(1);
    expect(wrapper.find("h2").text()).toBe(mockHeading);
  });

  it("renders description text", () => {
    const wrapper = shallow(<CustomError statusCode={500} />);

    expect(wrapper.find("p").length).toBe(1);
    expect(wrapper.find("p").text()).toBe(mockText);
  });

  it("renders link", () => {
    const wrapper = shallow(<CustomError statusCode={500} />);

    expect(wrapper.find(Link).length).toBe(1);
  });

  it("renders illustration", () => {
    const wrapper = shallow(<CustomError statusCode={500} />);

    expect(wrapper.find(IllustrationLost).length).toBe(1);
  });
});
