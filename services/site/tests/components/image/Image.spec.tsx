import { imageLoader } from "app/components/image/Image";
import getConfig from "next/config";

const assetBaseUrl = "https://cdn.domain";

jest.mock("next/config", () => jest.fn());

describe("image", () => {
  describe("image loader", () => {
    beforeEach(() => {
      jest.resetAllMocks();
      (getConfig as jest.Mock).mockReturnValue({ publicRuntimeConfig: { assetBaseUrl } });
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

      expect(url.searchParams.get("url")).toContain("/image.jpg");
    });

    it("prepends the asset base url if it is configured", () => {
      const src = "/image.jpg";

      const url = new URL(imageLoader({ src, width: 10 }), "https://base.url");

      expect(url.searchParams.get("url")).toEqual(`${assetBaseUrl}${src}`);
    });
  });
});
