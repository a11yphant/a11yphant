import { imageLoader } from "app/components/image/Image";

const assetBaseUrl = "https://cdn.domain";

describe("image", () => {
  describe("image loader", () => {
    afterEach(() => {
      delete process.env.NEXT_PUBLIC_SITE_ASSET_BASE_URL;
    });

    it("forwards the width", () => {
      const url = new URL(imageLoader({ src: "/image.jpg", width: 10 }), "https://base.url");

      expect(url.searchParams.get("w")).toEqual("10");
    });

    it("forwards a default quality if none is set", () => {
      const url = new URL(imageLoader({ src: "/image.jpg", width: 10 }), "https://base.url");

      expect(url.searchParams.get("q")).toEqual("75");
    });

    it("forwards the quality", () => {
      const url = new URL(imageLoader({ src: "/image.jpg", width: 10, quality: 50 }), "https://base.url");

      expect(url.searchParams.get("q")).toEqual("50");
    });

    it("forwards the url", () => {
      const url = new URL(imageLoader({ src: "/image.jpg", width: 10, quality: 50 }), "https://base.url");

      expect(url.searchParams.get("url")).toEqual("/image.jpg");
    });

    it("prepends the asset base url if it is configured", () => {
      process.env.NEXT_PUBLIC_SITE_ASSET_BASE_URL = assetBaseUrl;
      const src = "/image.jpg";

      const url = new URL(imageLoader({ src, width: 10 }), "https://base.url");

      expect(url.searchParams.get("url")).toEqual(`${assetBaseUrl}${src}`);
    });
  });
});
