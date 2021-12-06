import "@testing-library/jest-dom";

import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import { mockUsePrefersReducedMotion } from "app/tests/components/helper/mockUsePrefersReducedMotion";
import Enzyme from "enzyme";

Enzyme.configure({ adapter: new Adapter() });

mockUsePrefersReducedMotion();
