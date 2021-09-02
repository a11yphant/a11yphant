import ScrollOverlayWrapper from "app/components/common/scrollOverlayWrapper";
import { Level } from "app/generated/graphql";
import clsx from "clsx";
import React from "react";
import sanitizeHtml from "sanitize-html";

import HintList from "./sidebar/HintList";

interface SidebarProps {
  className: string;
  challengeName: string;
  level: Pick<Level, "instructions" | "tasks">;
}

const Sidebar: React.FunctionComponent<SidebarProps> = ({ className, challengeName, level }) => {
  return (
    <aside className={clsx("w-sidebar py-4", "container-dark", className)}>
      <ScrollOverlayWrapper
        className={"w-full h-full px-7 pb-1 flex flex-col overflow-auto"}
        classNameTop={"w-sidebar h-28 top-20 rotate-180"}
        classNameBottom={"w-sidebar h-44"}
      >
        <h2 className={clsx("text-grey-middle", "h6")}>{challengeName}</h2>
        <h3 className={clsx("my-8", "h4")}>Instructions</h3>
        <p className={clsx("whitespace-pre-wrap", "prose")} dangerouslySetInnerHTML={{ __html: sanitizeHtml(level.instructions) }} />
        <HintList tasks={level.tasks} />
      </ScrollOverlayWrapper>
    </aside>
  );
};

export default Sidebar;
