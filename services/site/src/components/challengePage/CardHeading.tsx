import clsx from "clsx";

interface CardHeadingProps {
  isTopChallenge: boolean;
}

const CardHeading: React.FunctionComponent<React.PropsWithChildren<CardHeadingProps>> = ({ children, isTopChallenge }) => {
  return isTopChallenge ? <h3 className={clsx("w-full")}>{children}</h3> : <h4 className={clsx("w-full")}>{children}</h4>;
};

export default CardHeading;
