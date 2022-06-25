import "@testing-library/jest-dom/extend-expect";

import IllustrationLost from "app/components/icons/IllustrationLost";
import CustomError from "app/pages/_error";
import { shallow } from "enzyme";
import { NextPageContext } from "next";
import Link from "next/link";
import React from "react";

beforeEach(() => {
  jest.resetAllMocks();
});

const mockHeading = "Error 500";
const mockText = "ooops, something went wrong";

describe("Error Page", () => {
  it("renders the wrapper elements", () => {
    const wrapper = shallow(<CustomError statusCode={500} />);

    expect(wrapper.find("main").length).toBe(1);
    expect(wrapper.find("section").length).toBe(1);
  });

  it("renders a heading with the status code", () => {
    const wrapper = shallow(<CustomError statusCode={500} />);

    expect(wrapper.find("h1").length).toBe(1);
    expect(wrapper.find("h1").text()).toBe(mockHeading);
  });

  it("renders a description text", () => {
    const wrapper = shallow(<CustomError statusCode={500} />);

    expect(wrapper.find("p").length).toBe(1);
    expect(wrapper.find("p").text()).toBe(mockText);
  });

  it("renders a link", () => {
    const wrapper = shallow(<CustomError statusCode={500} />);

    expect(wrapper.find(Link).length).toBe(1);
  });

  it("renders the error illustration", () => {
    const wrapper = shallow(<CustomError statusCode={500} />);

    expect(wrapper.find(IllustrationLost).length).toBe(1);
  });

  it("disables capturing errors on the frontend if getInitialProps has already been run", async () => {
    const error = new Error("test");
    const { hasGetInitialPropsRun } = await CustomError.getInitialProps({ err: error } as NextPageContext);

    expect(hasGetInitialPropsRun).toBe(true);
  });
});
