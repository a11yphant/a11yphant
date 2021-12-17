import createCache, { EmotionCache } from "@emotion/cache";

export default function createEmotionCache(): EmotionCache {
  return createCache({ key: "css" });
}
