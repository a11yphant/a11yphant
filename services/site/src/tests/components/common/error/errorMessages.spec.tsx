import { cleanup } from "@testing-library/react";
import { NetworkError, UnknownError } from "app/components/common/error/errorMessages";
import { shallow } from "enzyme";
import React from "react";

afterEach(cleanup);

describe("Error Messages", () => {
  // TODO: find "exists" hier iwi unpassend, mir fällt aber keine alternative ein
  it("networkError exists", () => {
    const wrapper = shallow(<NetworkError />);

    expect(wrapper.text()).toContain("Network error");
  });

  it("unknownError exists", () => {
    const wrapper = shallow(<UnknownError />);

    expect(wrapper.text()).toContain("Unknown error");
  });
});
