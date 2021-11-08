import Button from "app/components/buttons/Button";
import { ChallengeModalLevelCard } from "app/components/homepage/challengeModal/ChallengeModalLevelCard";
import LoadingIndicator from "app/components/icons/LoadingIndicator";
import { Modal } from "app/components/modal/Modal";
import { ModalActions } from "app/components/modal/ModalActions";
import { ModalTitle } from "app/components/modal/ModalTitle";
import { Level, LevelStatus, useChallengeDetailsBySlugQuery } from "app/generated/graphql";
import clsx from "clsx";
import { useRouter } from "next/router";
import React from "react";
import sanitizeHtml from "sanitize-html";

interface ChallengeModalProps {
  open: boolean;
  onClose: () => void;
  challengeSlug?: string;
}

const getFirstOpenLevel = (levels: Array<Pick<Level, "id" | "status">>): string | undefined => {
  for (const level of levels) {
    if (level.status === LevelStatus.Open || level.status === LevelStatus.InProgress) {
      return level.id;
    }
  }

  return undefined;
};

export const ChallengeModal = ({ open, onClose, challengeSlug }: ChallengeModalProps): React.ReactElement => {
  const router = useRouter();

  const { data } = useChallengeDetailsBySlugQuery({
    variables: {
      slug: challengeSlug,
    },
    skip: challengeSlug === undefined,
  });
  const challenge = data?.challenge;
  const firstOpenLevelId = challenge === undefined ? undefined : getFirstOpenLevel(challenge.levels);

  return (
    <Modal
      open={open}
      onClose={onClose}
      className={clsx(
        "bg-background-light",
        "p-8 w-[80%] h-[80%]",
        "flex flex-col",
        "md:px-12 md:py-10 md:min-w-[32rem] md:mx-auto",
        "lg:px-16 lg:py-14",
        "xl:px-20 xl:py-16",
      )}
    >
      {challenge === undefined && <LoadingIndicator />}

      {challenge && (
        <>
          <section>
            <ModalTitle className={clsx("pb-14")}>{challenge.name}</ModalTitle>
            <p className="prose" dangerouslySetInnerHTML={{ __html: sanitizeHtml(challenge.introduction) }} />
          </section>

          <div className={clsx("grid grid-cols-3 gap-x-24 gap-y-4", "pt-8")}>
            {challenge.levels.map((level) => {
              return (
                <ChallengeModalLevelCard
                  key={level.id}
                  challengeSlug={challengeSlug}
                  nthLevel={level.order}
                  status={level.status}
                  firstOpenLevel={level.id === firstOpenLevelId}
                />
              );
            })}
          </div>

          <ModalActions>
            <Button onClick={onClose} overrideClassName className={clsx("text-grey-middle", "mr-14", "hover:border-b hover:border-grey-middle")}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                const firstOpenLevel = challenge.levels.find((level) => level.id === firstOpenLevelId);

                router.push(
                  `/challenge/${challengeSlug}/level/${Number(firstOpenLevel?.order ?? 1).toLocaleString("de-AT", {
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
