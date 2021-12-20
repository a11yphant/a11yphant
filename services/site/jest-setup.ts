import "@testing-library/jest-dom";

import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import { setupIntersectionObserverMock } from "app/lib/test-helpers/setupIntersectionObserverMock";
import { mockUsePrefersReducedMotion } from "app/tests/helper/mockUsePrefersReducedMotion";
import Enzyme from "enzyme";
import { setConfig } from "next/config";
import React from "react";

import config from "./next.config";

Enzyme.configure({ adapter: new Adapter() });

setConfig(config);

mockUsePrefersReducedMotion();
setupIntersectionObserverMock();

React.useLayoutEffect = React.useEffect;
