import Button from "app/components/buttons/Button";
import ButtonLoading from "app/components/buttons/ButtonLoading";
import SmallScreenNotification from "app/components/common/SmallScreenNotification";
import Navigation from "app/components/Navigation";
import clsx from "clsx";
import React, { useState } from "react";

const Quiz: React.FunctionComponent = () => {
  const [showSubmitLoadingAnimation, setShowSubmitLoadingAnimation] = useState(false);

  //   const {
  //     // setLevelId,
  //     // submissionId,
  //     // setSubmissionId,
  //     // setSubmissionCode,
  //     // submissionCode,
  //     // updateSubmission,
  //     loading: autoSaveLoading,
  //   } = useSubmissionAutoSave();

  const submitLevel = async (): Promise<void> => {
    setShowSubmitLoadingAnimation(true);

    // await updateSubmission();

    // await requestCheckMutation({
    //   variables: { requestCheckInput: { submissionId } },
    // });

    // router.push(`${router.asPath}/evaluation/${submissionId}`);
  };

  return (
    <>
      <Navigation displayBreadcrumbs>
        {/* TODO: display autosave */}
        {/* <Transition
          show={autoSaveLoading}
          enter="transition-opacity duration-300"
          enterTo="opacity-100"
          leave="transition-opacity duration-300 delay-1000"
          leaveTo="opacity-0"
        >
          <span>
            Saving... <LoadingIndicator className="inline ml-4" />
          </span>
        </Transition> */}
      </Navigation>
      <main className={clsx("h-main box-border mx-auto p-4")}>
        <SmallScreenNotification />
        <section
          className={clsx("mx-auto h-full w-full box-border hidden", "container-dark", "lg:px-12 lg:pt-12 lg:flex lg:flex-col lg:justify-between")}
        >
          <h2 className={clsx("mb-2", "h5")}>Quiz</h2>
          <div className={clsx("grid grid-cols-7")}>
            <h3 className={clsx("h2 leading-tight tracking-wider font-mono col-span-4 mr-8")}>What is the purpose of the head tag?</h3>
            <div className={clsx("col-span-3")}>
              <Button
                // onClick={}
                overrideClassName
                className={clsx(
                  "px-10 py-8 mb-6 w-full rounded-lg border border-white text-left",
                  "transition duration-300",
                  "hover:bg-primary hover:border-primary hover:text-light",
                  "focus:bg-primary focus:border-primary focus:text-light focus:outline-none",
                )}
              >
                This tag does not exist in the HTML specification.
              </Button>
              <Button
                // onClick={}
                overrideClassName
                className={clsx(
                  "px-10 py-8 mb-6 w-full rounded-lg border border-white text-left",
                  "transition duration-300",
                  "hover:bg-primary hover:border-primary hover:text-light",
                  "focus:bg-primary focus:border-primary focus:text-light focus:outline-none",
                )}
              >
                It contains meta information regarding the page, for example the title.
              </Button>
              <Button
                // onClick={}
                overrideClassName
                className={clsx(
                  "px-10 py-8 mb-6 w-full rounded-lg border border-white text-left",
                  "transition duration-300",
                  "hover:bg-primary hover:border-primary hover:text-light",
                  "focus:bg-primary focus:border-primary focus:text-light focus:outline-none",
                )}
              >
                It contains the content of the page.
              </Button>
              <Button
                // onClick={}
                overrideClassName
                className={clsx(
                  "px-10 py-8 mb-6 w-full rounded-lg border border-white text-left",
                  "transition duration-300",
                  "hover:bg-primary hover:border-primary hover:text-light",
                  "focus:bg-primary focus:border-primary focus:text-light focus:outline-none",
                )}
              >
                This tag should contain the website's logo.
              </Button>
            </div>
          </div>
          <div className="flex justify-end mr-[-3rem]">
            <ButtonLoading
              primary
              onClick={submitLevel}
              className="px-10 absolute right-0 bottom-0"
              loading={showSubmitLoadingAnimation}
              submitButton
              srTextLoading="The submission is being processed."
            >
              Submit
            </ButtonLoading>
          </div>
        </section>
      </main>
    </>
  );
};

export default Quiz;
