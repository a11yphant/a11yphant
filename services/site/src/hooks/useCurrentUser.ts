import { useCurrentUserQuery, User } from "app/generated/graphql";

interface CurrentUserApi {
  currentUser?: User;
}

export const useCurrentUser = (): CurrentUserApi => {
  const { data } = useCurrentUserQuery({ ssr: false });

  return { currentUser: data?.currentUser };
};
