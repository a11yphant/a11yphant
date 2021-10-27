import splitbee from "@splitbee/web";
import { initializeTracking } from "app/lib/tracking";

jest.mock("@splitbee/web", () => {
  return {
    init: jest.fn(),
  };
});

beforeEach(() => {
  jest.resetAllMocks();
});

afterEach(() => {
  (process as any).browser = undefined;
  process.env.NEXT_PUBLIC_SITE_SPLITBEE_TOKEN = undefined;
});

describe("splitbee tracking", () => {
  it("initializes splitbee", async () => {
    (process as any).browser = true;
    process.env.NEXT_PUBLIC_SITE_SPLITBEE_TOKEN = "123";
    initializeTracking();

    expect(splitbee.init).toHaveBeenCalled();
  });

  it("does not initialize splitbee outside of a browser", async () => {
    (process as any).browser = false;
    process.env.NEXT_PUBLIC_SITE_SPLITBEE_TOKEN = "123";
    initializeTracking();

    expect(splitbee.init).not.toHaveBeenCalled();
  });

  it("does not initialize splitbee without token", async () => {
    (process as any).browser = true;
    process.env.NEXT_PUBLIC_SITE_SPLITBEE_TOKEN = "";
    initializeTracking();

    expect(splitbee.init).not.toHaveBeenCalled();
  });
});
