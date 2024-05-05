import { getDifficultyIconByChallengeDifficulty } from "app/components/challengePage/difficulties/Difficulties";
import Footer from "app/components/Footer";
import Check from "app/components/icons/Check";
import Navigation from "app/components/Navigation";
import { ChallengeDetailsBySlugDocument, ChallengeDetailsBySlugQuery, ChallengeDetailsBySlugQueryResult, LevelStatus } from "app/generated/graphql";
import { getApolloClient } from "app/lib/apollo-client/rsc";
import clsx from "clsx";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import sanitizeHtml from "sanitize-html";

type PageProps = {
  params: {
    challengeSlug: string;
  };
};

async function getChallenge(slug: string): Promise<ChallengeDetailsBySlugQueryResult["data"]["challenge"]> {
  const client = getApolloClient();

  const response = await client.query<ChallengeDetailsBySlugQuery>({
    query: ChallengeDetailsBySlugDocument,
    variables: { slug },
  });

  return response.data.challenge;
}

const Challenge = async ({ params: { challengeSlug } }: PageProps): Promise<React.ReactElement> => {
  const challenge = await getChallenge(challengeSlug);

  if (!challenge) {
    notFound();
  }

  const DifficultyIcon = getDifficultyIconByChallengeDifficulty(challenge.difficulty);
  const firstUnfinishedLevel = challenge.levels.find((level) => level.status === LevelStatus.Open || level.status === LevelStatus.InProgress);

  return (
    <>
      <Navigation displayBreadcrumbs />
      <main className="h-full box-border max-w-screen-3xl mx-auto mt-32">
        <div className="mx-8 h-main max-w-screen-3xl sm:mx-12 lg:mt-12 lg:mx-24">
          <h1 className="mb-8 h2 md:h1">
            <span className="sr-only">Challenge: </span>
            {challenge?.name}
            <div className={clsx("inline-block")}>
              <DifficultyIcon className={clsx("w-5 h-12 inline-block")} firstClassName="ml-4" />
            </div>
          </h1>
          <p className="prose" dangerouslySetInnerHTML={{ __html: sanitizeHtml(challenge.introduction) }} />

          <ul className="gap-4 pt-8 grid grid-cols-1 gap-y-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {challenge.levels.map((level, index) => {
              const isFirstUnfinishedLevel = level.id === firstUnfinishedLevel?.id;

              function getTitlePrefix(): string {
                if (index === 0 && isFirstUnfinishedLevel) {
                  return "Start here: ";
                }

                if (isFirstUnfinishedLevel) {
                  return "Up next: ";
                }

                return "";
              }

              return (
                <li className="m-0 p-0" key={level.id}>
                  <Link
                    href={`/challenges/${challengeSlug}/level/${String(level.order).padStart(2, "0")}`}
                    className={clsx(
                      "relative block border border-solid rounded-lg px-4 py-3 w-full h-18",
                      "hover:bg-primary-dark hover:border-primary-dark",
                      !isFirstUnfinishedLevel && "border-grey-dark",
                      isFirstUnfinishedLevel && "border-primary bg-primary",
                    )}
                  >
                    <span className="h3 text-base text-grey block">
                      {getTitlePrefix()}Level {String(level.order).padStart(2, "0")}
                    </span>
                    <span
                      className={clsx(
                        "font-normal mb-0 block",
                        !isFirstUnfinishedLevel && "text-grey-middle",
                        isFirstUnfinishedLevel && "text-white",
                      )}
                    >
                      {level.__typename === "QuizLevel" ? "Quiz" : "Coding"}
                    </span>
                    {level.status === LevelStatus.Finished && (
                      <>
                        <span className="sr-only">Completed</span>
                        <Check className="h-7 w-10 absolute top-4 right-5 text-light" />
                      </>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Challenge;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const challengeMetadata: Record<string, Partial<Metadata>> = {
    "a-valid-html-document": {
      description:
        "A valid HTML document lays the foundation for an accessible web page. Assistive technologies extract information based on the structure of the document.",
      openGraph: {
        description:
          "A valid HTML document lays the foundation for an accessible web page. Assistive technologies extract information based on the structure of the document.",
        images: [
          {
            url: "https://a11yphant.com/images/SEO/mockups-CHALLENGE-valid-doc.jpg",
            alt: "A screenshot of the a11yphant challenge page, displaying all possible quiz and coding levels to complete.",
          },
        ],
      },
      twitter: {
        description:
          "A valid HTML document lays the foundation for an accessible web page. Assistive technologies extract information based on the structure of the document.",
        images: [{ url: "https://a11yphant.com/images/SEO/mockups-CHALLENGE-valid-doc.jpg" }],
      },
    },
    headings: {
      description:
        "You will learn how to use the six available HTML headings to structure your page. A logical structure is very important for web accessibility.",
      openGraph: {
        description:
          "You will learn how to use the six available HTML headings to structure your page. A logical structure is very important for web accessibility.",
        images: [
          {
            url: "https://a11yphant.com/images/SEO/mockups-CHALLENGE-headings.jpg",
            alt: "A screenshot of the a11yphant challenge page, displaying all possible quiz and coding levels to complete.",
          },
        ],
      },
      twitter: {
        description:
          "You will learn how to use the six available HTML headings to structure your page. A logical structure is very important for web accessibility.",
        images: [{ url: "https://a11yphant.com/images/SEO/mockups-CHALLENGE-headings.jpg" }],
      },
    },
    links: {
      description:
        "Hyperlinks are one of the most fundamental concepts of the web. Without meaningful links, users might be unable to find the desired information.",
      openGraph: {
        description:
          "Hyperlinks are one of the most fundamental concepts of the web. Without meaningful links, users might be unable to find the desired information.",
        images: [
          {
            url: "https://a11yphant.com/images/SEO/mockups-CHALLENGE-links.jpg",
            alt: "A screenshot of the a11yphant challenge page, displaying all possible quiz and coding levels to complete.",
          },
        ],
      },
      twitter: {
        description:
          "Hyperlinks are one of the most fundamental concepts of the web. Without meaningful links, users might be unable to find the desired information.",
        images: [{ url: "https://a11yphant.com/images/SEO/mockups-CHALLENGE-links.jpg" }],
      },
    },
    "page-regions": {
      description:
        "The foundation to building accessible websites is using semantically meaningful markup. It structures a page into common sections, like headers and navigations.",
      openGraph: {
        description:
          "The foundation to building accessible websites is using semantically meaningful markup. It structures a page into common sections, like headers and navigations.",
        images: [
          {
            url: "https://a11yphant.com/images/SEO/mockups-CHALLENGE-page-regions.jpg",
            alt: "A screenshot of the a11yphant challenge page, displaying all possible quiz and coding levels to complete.",
          },
        ],
      },
      twitter: {
        description:
          "The foundation to building accessible websites is using semantically meaningful markup. It structures a page into common sections, like headers and navigations.",
        images: [{ url: "https://a11yphant.com/images/SEO/mockups-CHALLENGE-page-regions.jpg" }],
      },
    },
    buttons: {
      description:
        "Learn how to utilise and design HTML buttons to make them accessible. Buttons are critical to user engagement. There are many things to consider. ",
      openGraph: {
        description:
          "Learn how to utilise and design HTML buttons to make them accessible. Buttons are critical to user engagement. There are many things to consider. ",
        images: [
          {
            url: "https://a11yphant.com/images/SEO/mockups-CHALLENGE-buttons.jpg",
            alt: "A screenshot of the a11yphant challenge page, displaying all possible quiz and coding levels to complete.",
          },
        ],
      },
      twitter: {
        description:
          "Learn how to utilise and design HTML buttons to make them accessible. Buttons are critical to user engagement. There are many things to consider. ",
        images: [{ url: "https://a11yphant.com/images/SEO/mockups-CHALLENGE-buttons.jpg" }],
      },
    },
    "intro-to-web-accessibility": {
      description:
        "This quiz-only challenge gives a brief introduction to what web accessibility is. The accessibility of websites is an important aspect of social inclusion. ",
      openGraph: {
        description:
          "This quiz-only challenge gives a brief introduction to what web accessibility is. The accessibility of websites is an important aspect of social inclusion. ",
        images: [
          {
            url: "https://a11yphant.com/images/SEO/mockups-CHALLENGE-a11y-intro.jpg",
            alt: "A screenshot of the a11yphant challenge page, displaying all possible quiz and coding levels to complete.",
          },
        ],
      },
      twitter: {
        description:
          "This quiz-only challenge gives a brief introduction to what web accessibility is. The accessibility of websites is an important aspect of social inclusion. ",
        images: [{ url: "https://a11yphant.com/images/SEO/mockups-CHALLENGE-a11y-intro.jpg" }],
      },
    },
    "content-elements": {
      description:
        "In this challenge, you will get an overview of a few simple HTML elements that you can use to structure the content on your page.",
      openGraph: {
        description:
          "In this challenge, you will get an overview of a few simple HTML elements that you can use to structure the content on your page.",
        images: [
          {
            url: "https://a11yphant.com/images/SEO/mockups-CHALLENGE-content-element.jpg",
            alt: "A screenshot of the a11yphant challenge page, displaying all possible quiz and coding levels to complete.",
          },
        ],
      },
      twitter: {
        description:
          "In this challenge, you will get an overview of a few simple HTML elements that you can use to structure the content on your page.",
        images: [{ url: "https://a11yphant.com/images/SEO/mockups-CHALLENGE-content-element.jpg" }],
      },
    },
  };

  const metadata = challengeMetadata[params.challengeSlug] || {};

  const challenge = await getChallenge(params.challengeSlug);
  return {
    title: `Challenge: ${challenge.name} | a11yphant`,
    openGraph: {
      url: `https://a11yphant.com/challenges/${challenge.name}`,
      title: `Challenge: ${challenge.name} | a11yphant`,
    },
    twitter: {
      title: `Challenge: ${challenge.name} | a11yphant`,
    },
    ...metadata,
  };
}
