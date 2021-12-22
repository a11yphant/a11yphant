import "@testing-library/jest-dom";

import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import { setupIntersectionObserverMock } from "app/lib/test-helpers/setupIntersectionObserverMock";
import Enzyme from "enzyme";
import { setConfig } from "next/config";
import React from "react";
import { mockUsePrefersReducedMotion } from "tests/helper/mockUsePrefersReducedMotion";

import config from "./next.config";

Enzyme.configure({ adapter: new Adapter() });

setConfig(config);

mockUsePrefersReducedMotion();
setupIntersectionObserverMock();

React.useLayoutEffect = React.useEffect;
