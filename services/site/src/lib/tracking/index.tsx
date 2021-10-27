import splitbee from "@splitbee/web";

export function initializeTracking(): void {
  if (!process.browser) return;
  if (!process.env.NEXT_PUBLIC_SITE_SPLITBEE_TOKEN) return;

  splitbee.init({
    scriptUrl: "/bee.js",
    apiUrl: "/_hive",
    disableCookie: true,
    token: process.env.NEXT_PUBLIC_SITE_SPLITBEE_TOKEN,
  });
}
