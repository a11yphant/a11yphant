import createCache from "@emotion/cache";
import createEmotionCache from "app/lib/emotion/createEmotionCache";

jest.mock("@emotion/cache", () => jest.fn());

describe("createEmotionCache", () => {
  it("creates a new emotion cache", () => {
    const emotionCache = jest.fn();
    (createCache as jest.Mock).mockReturnValue(emotionCache);
    const cache = createEmotionCache();

    expect(createCache).toHaveBeenCalledWith({ key: "css" });
    expect(cache).toEqual(emotionCache);
  });
});
