import { Level } from "app/generated/graphql";
import clsx from "clsx";
import React from "react";
import sanitizeHtml from "sanitize-html";

import TaskList from "./sidebar/TaskList";

interface SidebarProps {
  className: string;
  challengeName: string;
  level: Pick<Level, "instructions" | "tasks">;
}

const Sidebar: React.FunctionComponent<SidebarProps> = ({ className, challengeName, level }) => {
  return (
    <aside className={clsx("w-sidebar py-4 px-7", "container-dark overflow-auto", className)}>
      <div className="flex flex-col w-full min-h-full">
        <h2 className={clsx("text-grey-middle", "h6")}>{challengeName}</h2>
        <h3 className={clsx("my-8", "h4")}>Instructions</h3>
        <p className={clsx("whitespace-pre-wrap", "prose")} dangerouslySetInnerHTML={{ __html: sanitizeHtml(level.instructions) }} />
        <TaskList tasks={level.tasks} />
      </div>
    </aside>
  );
};

export default Sidebar;
