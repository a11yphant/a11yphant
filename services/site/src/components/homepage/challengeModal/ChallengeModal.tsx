import Button from "app/components/buttons/Button";
import ScrollOverlayWrapper from "app/components/common/ScrollOverlayWrapper";
import { ChallengeModalLevelCard } from "app/components/homepage/challengeModal/ChallengeModalLevelCard";
import { getDifficultyIconByChallengeDifficulty } from "app/components/homepage/difficulties/Difficulties";
import LoadingIndicator from "app/components/icons/LoadingIndicator";
import { Modal } from "app/components/modal/Modal";
import { ModalActions } from "app/components/modal/ModalActions";
import { ModalTitle } from "app/components/modal/ModalTitle";
import { LevelStatus, useChallengeDetailsBySlugQuery } from "app/generated/graphql";
import clsx from "clsx";
import { useRouter } from "next/router";
import React from "react";
import sanitizeHtml from "sanitize-html";

interface ChallengeModalProps {
  open: boolean;
  onClose: () => void;
  challengeSlug?: string;
}

export const ChallengeModal = ({ open, onClose, challengeSlug }: ChallengeModalProps): React.ReactElement => {
  const router = useRouter();

  const { data, loading } = useChallengeDetailsBySlugQuery({
    variables: {
      slug: challengeSlug,
    },
    skip: challengeSlug === undefined,
  });
  const challenge = data?.challenge;
  const firstUnfinishedLevel =
    challenge === undefined
      ? undefined
      : challenge.levels.find((level) => level.status === LevelStatus.Open || level.status === LevelStatus.InProgress);
  const DifficultyIcon = challenge === undefined ? null : getDifficultyIconByChallengeDifficulty(challenge.difficulty);

  return (
    <Modal
      open={open}
      onClose={onClose}
      className={clsx(
        "bg-background-light",
        "p-8 w-full h-full",
        "flex flex-col",
        "sm:w-[80%] sm:h-[80%] sm:max-w-[1250px] sm:max-h-[775px]",
        "md:px-12 md:py-10 md:mx-auto",
        "lg:px-16 lg:py-14",
        "xl:px-20 xl:py-16",
      )}
    >
      {loading && (
        <div className={clsx("w-full h-full", "flex justify-center items-center")}>
          <LoadingIndicator />
        </div>
      )}

      {!loading && challenge && (
        <>
          <ScrollOverlayWrapper
            className={clsx("max-h-full overflow-auto mb-20")}
            classNameTopOverlay="h-28 -mb-28 from-background-light"
            classNameBottomOverlay="h-28 -mt-28 from-background-light"
          >
            <section>
              <ModalTitle className={clsx("pb-14", "text-4xl")}>
                {challenge.name}
                <div className={clsx("inline-block")}>
                  <DifficultyIcon className={clsx("w-2.5 h-6 inline-block")} firstClassName="ml-4" />
                </div>
              </ModalTitle>
              <p className="prose" dangerouslySetInnerHTML={{ __html: sanitizeHtml(challenge.introduction) }} />
            </section>

            <div className={clsx("gap-4 pt-8", "grid grid-cols-1 gap-y-4", "xs:grid-cols-2", "lg:grid-cols-3", "2xl:grid-cols-4")}>
              {challenge.levels.map((level) => {
                return (
                  <ChallengeModalLevelCard
                    key={level.id}
                    challengeSlug={challengeSlug}
                    levelNumber={level.order}
                    status={level.status}
                    type={level.__typename}
                    isFirstUnfinishedLevel={level.id === firstUnfinishedLevel?.id}
                  />
                );
              })}
            </div>
          </ScrollOverlayWrapper>

          <ModalActions>
            <Button
              onClick={onClose}
              overrideClassName
              className={clsx(
                "mr-14 text-grey-middle border-b-2 border-transparent",
                "transition-colors duration-300",
                "hover:text-primary-light hover:border-primary-light",
                "focus-rounded-instead-of-underline",
              )}
            >
              Cancel
            </Button>
            <Button
              primary
              onClick={() => {
                router.push(
                  `/challenge/${challengeSlug}/level/${Number(firstUnfinishedLevel?.order ?? 1).toLocaleString("de-AT", {
                    minimumIntegerDigits: 2,
                    useGrouping: false,
                  })}`,
                );
              }}
            >
              Start Coding
            </Button>
          </ModalActions>
        </>
      )}
    </Modal>
  );
};
