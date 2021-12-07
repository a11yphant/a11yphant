import splitbee from "@splitbee/web";
import getConfig from "next/config";

export function initializeTracking(): void {
  const { publicRuntimeConfig } = getConfig();

  if (!process.browser) return;
  if (!publicRuntimeConfig.splitbeeToken) return;

  splitbee.init({
    disableCookie: true,
    token: publicRuntimeConfig.splitbeeToken,
  });
}
