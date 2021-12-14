import { cleanup } from "@testing-library/react";
import { NetworkError, UnknownError } from "app/components/common/error/errorMessages";
import { shallow } from "enzyme";
import React from "react";

afterEach(cleanup);

describe("Error Messages", () => {
  it("renders 'Network error' in `NetworkError` component", () => {
    const wrapper = shallow(<NetworkError />);

    expect(wrapper.text()).toContain("Network error");
  });

  it("renders 'Unknown error' in `UnknownError` component", () => {
    const wrapper = shallow(<UnknownError />);

    expect(wrapper.text()).toContain("Unknown error");
  });
});
