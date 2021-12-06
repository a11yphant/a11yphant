import splitbee from "@splitbee/web";
import { initializeTracking } from "app/lib/tracking";
import getConfig from "next/config";

jest.mock("@splitbee/web", () => {
  return {
    init: jest.fn(),
  };
});

jest.mock("next/config", () => jest.fn());

beforeEach(() => {
  jest.resetAllMocks();
});

afterEach(() => {
  (process as any).browser = undefined;
});

describe("splitbee tracking", () => {
  it("initializes splitbee", async () => {
    (process as any).browser = true;
    (getConfig as jest.Mock).mockReturnValue({ publicRuntimeConfig: { splitbeeToken: "123" } });

    initializeTracking();

    expect(splitbee.init).toHaveBeenCalled();
  });

  it("does not initialize splitbee outside of a browser", async () => {
    (process as any).browser = false;
    (getConfig as jest.Mock).mockReturnValue({ publicRuntimeConfig: { splitbeeToken: "123" } });
    initializeTracking();

    expect(splitbee.init).not.toHaveBeenCalled();
  });

  it("does not initialize splitbee without token", async () => {
    (process as any).browser = true;
    (getConfig as jest.Mock).mockReturnValue({ publicRuntimeConfig: { splitbeeToken: "" } });
    initializeTracking();

    expect(splitbee.init).not.toHaveBeenCalled();
  });
});
