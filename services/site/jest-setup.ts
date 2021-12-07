import "@testing-library/jest-dom";

import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import Enzyme from "enzyme";
import { setConfig } from "next/config";

import config from "./next.config";

Enzyme.configure({ adapter: new Adapter() });
setConfig(config);
