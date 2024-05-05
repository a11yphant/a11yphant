import clsx from "clsx";
import Link from "next/link";
import React from "react";

interface QuoteCardProps {
  quote: string;
  author: string;
  url: string;
}
const QuoteCard: React.FunctionComponent<React.PropsWithChildren<QuoteCardProps>> = ({ quote, author, url }) => {
  return (
    <blockquote
      cite={url}
      className={clsx(
        "flex flex-col relative grow shrink xs:basis-96 items-center justify-center p-6 m-2 container-dark",
        "md:p-8 md:mx-6 md:my-4",
        "lg:mx-8 lg:my-6",
      )}
    >
      <span
        className={clsx("text-[8rem] text-primary absolute top-[-3.8rem] left-[-1rem]", "lg:text-[12rem] lg:top-[-5.5rem] lgleft-[-1.5rem]")}
        aria-hidden="true"
      >
        “
      </span>
      <p className={clsx("h5 mt-2 mb-6 text-center font-medium", "md:max-w-[40ch]", "lg:h4 lg:max-w-[40ch] lg:font-medium")}>{quote}</p>
      <footer>
        <cite>
          <Link
            href={url}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className={clsx(
              "block py-1.5 px-4 text-grey-middle font-medium not-italic uppercase tracking-[0.18rem] text-center text-sm",
              "border-none underline decoration-grey-middle underline-offset-4 decoration-2",
              "transition-colors duration-300",
              "hover:text-primary-light hover:decoration-transparent",
              "focus-rounded-instead-of-underline",
            )}
          >
            {author}
            <span className="sr-only">(opens in a new tab)</span>
          </Link>
        </cite>
      </footer>
    </blockquote>
  );
};

export default QuoteCard;
