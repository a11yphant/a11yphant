import { ChallengeDetailsBySlugDocument, ChallengeDetailsBySlugQuery, ChallengeDetailsBySlugQueryResult } from "app/generated/graphql";
import { getApolloClient } from "app/lib/apollo-client/rsc";

export type Challenge = ChallengeDetailsBySlugQueryResult["data"]["challenge"];

export async function getChallenge(slug: string): Promise<Challenge> {
  const client = getApolloClient();

  const response = await client.query<ChallengeDetailsBySlugQuery>({
    query: ChallengeDetailsBySlugDocument,
    variables: { slug },
  });

  return response.data.challenge;
}
