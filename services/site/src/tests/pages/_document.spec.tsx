import createInstance from "@emotion/server/create-instance";
import createEmotionCache from "app/lib/emotion/createEmotionCache";
import CustomDocument from "app/pages/_document";
import { DocumentContext } from "next/document";

jest.mock("app/lib/emotion/createEmotionCache", () => jest.fn());
jest.mock("@emotion/server/create-instance", () => jest.fn());

function createContext(context: Partial<DocumentContext> = {}): DocumentContext {
  return {
    defaultGetInitialProps: jest.fn().mockReturnValue({ html: "" }),
    ...(context as DocumentContext),
  };
}

describe("custom document", () => {
  const extractCriticalToChunks = jest.fn().mockReturnValue({ styles: [] });
  beforeEach(() => {
    jest.clearAllMocks();
    (createInstance as jest.Mock).mockReturnValue({
      extractCriticalToChunks,
    });
    (createEmotionCache as jest.Mock).mockReturnValue({});
  });

  it("creates a new emotion cache", async () => {
    const cache = jest.fn();
    (createEmotionCache as jest.Mock).mockReturnValue(cache);
    const context = createContext();
    await CustomDocument.getInitialProps(context);

    expect(createEmotionCache).toHaveBeenCalled();
    expect(createInstance).toHaveBeenCalledWith(cache);
  });

  it("returns the styles for emotion", async () => {
    extractCriticalToChunks.mockReturnValue({ styles: [{ css: "", key: "", ids: [] }] });
    const context = createContext();
    const props = await CustomDocument.getInitialProps(context);

    expect(props.styles).toHaveLength(1);
  });
});
