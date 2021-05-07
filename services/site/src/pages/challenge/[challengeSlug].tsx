import { useRouter } from "next/router";
import React from "react";

const Challenge: React.FunctionComponent = () => {
  const router = useRouter();

  // @TODO: Replace with challenge modal
  React.useEffect(() => {
    router.push(`${router.asPath}/level/01`);
  }, []);

  return <div />;
};

export default Challenge;
