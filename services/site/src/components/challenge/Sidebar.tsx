import { Level } from "app/generated/graphql";
import clsx from "clsx";
import React from "react";
import sanitizeHtml from "sanitize-html";

import TaskList from "./sidebar/TaskList";

interface SidebarProps {
  classes: string;
  challengeName: string;
  level: Pick<Level, "instructions" | "tasks">;
}

const Sidebar: React.FunctionComponent<SidebarProps> = ({ classes, challengeName, level }) => {
  return (
    <aside className={clsx("w-sidebar py-4 px-7", "container-dark", classes)}>
      <div className="flex flex-col w-full h-full">
        <h2 className={clsx("text-greyMiddle", "h6")}>{challengeName}</h2>
        <h3 className={clsx("my-8", "h4")}>Instructions</h3>
        {/* TODO: check how text comes from backend and in which tag it has to be wrapped */}
        <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: sanitizeHtml(level.instructions) }} />
        <TaskList tasks={level.tasks} />
      </div>
    </aside>
  );
};

export default Sidebar;
