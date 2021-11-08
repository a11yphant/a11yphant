import "@testing-library/jest-dom/extend-expect";

import * as Sentry from "@sentry/nextjs";
import { cleanup } from "@testing-library/react";
import IllustrationLost from "app/components/icons/IllustrationLost";
import CustomError from "app/pages/_error";
import { shallow } from "enzyme";
import { NextPageContext } from "next";
import Link from "next/link";
import React from "react";

afterEach(cleanup);

jest.mock("@sentry/nextjs", () => ({
  captureException: jest.fn(),
}));

beforeEach(() => {
  jest.resetAllMocks();
});

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

    expect(wrapper.find("h1").length).toBe(1);
    expect(wrapper.find("h1").text()).toBe(mockHeading);
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

  it("does not capture errors if they have been captured on the server", () => {
    shallow(<CustomError statusCode={500} hasGetInitialPropsRun={true} err={new Error("test")} />);

    expect(Sentry.captureException).not.toHaveBeenCalled();
  });

  it("captures errors on the client side", () => {
    const error = new Error("test");
    shallow(<CustomError statusCode={500} hasGetInitialPropsRun={false} err={error} />);

    expect(Sentry.captureException).toHaveBeenCalledWith(error);
  });

  it("captures errors on the server side", () => {
    const error = new Error("test");
    CustomError.getInitialProps({ err: error } as NextPageContext);

    expect(Sentry.captureException).toHaveBeenCalledWith(error);
  });

  it("disables capturing errors on the frontend if ", async () => {
    const error = new Error("test");
    const { hasGetInitialPropsRun } = await CustomError.getInitialProps({ err: error } as NextPageContext);

    expect(hasGetInitialPropsRun).toBe(true);
  });
});
