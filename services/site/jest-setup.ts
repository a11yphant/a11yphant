import "@testing-library/jest-dom";
import "whatwg-fetch";

import { loadDevMessages, loadErrorMessages } from "@apollo/client/dev";
import failOnConsole from "jest-fail-on-console";
import { setConfig } from "next/config";
import React from "react";
import { mockUsePrefersReducedMotion } from "tests/helper/mockUsePrefersReducedMotion";
import { setupIntersectionObserverMock } from "tests/helpers/setupIntersectionObserverMock";

import config from "./next.config";

setConfig(config);

mockUsePrefersReducedMotion();
setupIntersectionObserverMock();
failOnConsole();
loadDevMessages();
loadErrorMessages();

React.useLayoutEffect = React.useEffect;

global.ResizeObserver = class {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
};
