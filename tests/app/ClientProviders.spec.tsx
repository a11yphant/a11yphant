import { render } from "@testing-library/react";
import ClientProviders from "app/app/ClientProviders";
import { ClientConfig } from "app/lib/config";

const config: ClientConfig = {
  isDevelopmentMode: true,
  graphqlEndpointPath: "http://localhost:3001/graphql",
  githubLoginEndpoint: "/github",
  twitterLoginEndpoint: "/twitter",
  isPlausibleEnabled: false,
  baseUrl: "http://localhost:3001",
};

jest.mock("next/navigation", () => ({
  useSearchParams: () => new Map(),
}));

describe("ClientProviders", () => {
  it("renders", () => {
    render(<ClientProviders config={config} />);
  });
});
