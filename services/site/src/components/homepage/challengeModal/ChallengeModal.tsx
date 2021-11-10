import Button from "app/components/buttons/Button";
import { ChallengeModalLevelCard } from "app/components/homepage/challengeModal/ChallengeModalLevelCard";
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
      {loading && <LoadingIndicator />}

      {!loading && challenge && (
        <>
          <div className={"overflow-auto mb-20"}>
            <section>
              <ModalTitle className={clsx("pb-14")}>{challenge.name}</ModalTitle>
              <p className="prose" dangerouslySetInnerHTML={{ __html: sanitizeHtml(challenge.introduction) }} />
            </section>

            <div className={clsx("p-2 pt-8", "grid grid-cols-1 gap-y-4", "sm:grid-cols-2", "lg:grid-cols-3", "2xl:grid-cols-4")}>
              {challenge.levels.map((level) => {
                return (
                  <ChallengeModalLevelCard
                    key={level.id}
                    challengeSlug={challengeSlug}
                    levelNumber={level.order}
                    status={level.status}
                    isFirstUnfinishedLevel={level.id === firstUnfinishedLevel?.id}
                  />
                );
              })}
            </div>
          </div>

          <ModalActions>
            <Button onClick={onClose} overrideClassName className={clsx("text-grey-middle", "mr-14", "hover:border-b hover:border-grey-middle")}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                router.push(
                  `/challenge/${challengeSlug}/level/${Number(firstUnfinishedLevel?.order ?? 1).toLocaleString("de-AT", {
                    minimumIntegerDigits: 2,
                    useGrouping: false,
                  })}`,
                );
              }}
              className="bg-primary px-8 py-4"
            >
              Start Coding
            </Button>
          </ModalActions>
        </>
      )}
    </Modal>
  );
};
