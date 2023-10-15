import { render } from "@testing-library/react";
import { ClientConfig } from "app/lib/config";

import ClientProviders from "../../src/app/ClientProviders";

const config: ClientConfig = {
  graphqlEndpointClient: "http://localhost:3001/graphql",
  githubLoginEndpoint: "/github",
  twitterLoginEndpoint: "/twitter",
  isPlausibleEnabled: false,
  baseUrl: "http://localhost:3001",
};

describe("ClientProviders", () => {
  it("renders", () => {
    render(<ClientProviders config={config} />);
  });
});
