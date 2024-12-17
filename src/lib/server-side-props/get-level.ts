import {
  LevelByChallengeSlugDocument,
  LevelByChallengeSlugQuery,
  LevelByChallengeSlugQueryResult,
  LevelByChallengeSlugQueryVariables,
} from "app/generated/graphql";
import { getApolloClient } from "app/lib/apollo-client/rsc";

export async function getLevel(nthLevel: string, challengeSlug: string): Promise<LevelByChallengeSlugQueryResult["data"]["level"]> {
  const client = getApolloClient();

  const response = await client.query<LevelByChallengeSlugQuery, LevelByChallengeSlugQueryVariables>({
    query: LevelByChallengeSlugDocument,
    variables: { nth: Number(nthLevel), challengeSlug },
  });

  return response.data.level;
}
