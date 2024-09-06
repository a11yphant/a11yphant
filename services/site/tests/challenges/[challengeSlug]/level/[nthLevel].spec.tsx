import { getServerSideProps } from "app/pages/challenges/[challengeSlug]/level/[nthLevel]";
import { GetServerSidePropsContext } from "next";

jest.mock("app/lib/apollo-client", () => ({
  initializeApollo: (_, __, context) => context.apolloClient,
}));

jest.mock("app/components/Lottie", () => ({}));

describe("nth level", () => {
  it("redirects to 404 if the level was not found", async () => {
    const apolloClient = {
      query: jest
        .fn()
        .mockResolvedValueOnce({})
        .mockResolvedValueOnce({
          data: { level: null },
        })
        .mockResolvedValueOnce({
          data: { challenge: { id: 23 } },
        }),
    };

    const result: any = await getServerSideProps({
      apolloClient,
      req: { headers: { host: "a11yphant.com" } },
      params: { challengeSlug: "challenge-1", nthLevel: "4" },
    } as unknown as GetServerSidePropsContext);

    expect(result.notFound).toBeTruthy();
  });

  it("redirects to 404 if the challenge was not found", async () => {
    const apolloClient = {
      query: jest
        .fn()
        .mockResolvedValueOnce({})
        .mockResolvedValueOnce({
          data: { level: { id: 23 } },
        })
        .mockResolvedValueOnce({
          data: { challenge: null },
        }),
    };

    const result: any = await getServerSideProps({
      apolloClient,
      req: { headers: { host: "a11yphant.com" } },
      params: { challengeSlug: "challenge-1", nthLevel: "4" },
    } as unknown as GetServerSidePropsContext);

    expect(result.notFound).toBeTruthy();
  });

  it("does not return 404 if the challenge and the level was found", async () => {
    const apolloClient = {
      cache: { extract: jest.fn() },
      query: jest
        .fn()
        .mockResolvedValueOnce({})
        .mockResolvedValueOnce({
          data: { level: { id: 23 } },
        })
        .mockResolvedValueOnce({
          data: { challenge: { id: 23 } },
        }),
    };

    const result: any = await getServerSideProps({
      apolloClient,
      req: { headers: { host: "a11yphant.com" } },
      params: { challengeSlug: "challenge-1", nthLevel: "4" },
    } as unknown as GetServerSidePropsContext);

    expect(result.notFound).toBeUndefined();
  });
});
