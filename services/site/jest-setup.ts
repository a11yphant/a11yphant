import "@testing-library/jest-dom";

import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import Enzyme from "enzyme";
import failOnConsole from "jest-fail-on-console";
import { setConfig } from "next/config";
import React from "react";
import { mockUsePrefersReducedMotion } from "tests/helper/mockUsePrefersReducedMotion";
import { setupIntersectionObserverMock } from "tests/helpers/setupIntersectionObserverMock";

import config from "./next.config";

Enzyme.configure({ adapter: new Adapter() });

setConfig(config);

mockUsePrefersReducedMotion();
setupIntersectionObserverMock();
failOnConsole();

React.useLayoutEffect = React.useEffect;

global.ResizeObserver = class {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
};
