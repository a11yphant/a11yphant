import clsx from "clsx";
import React from "react";
import sanitizeHtml from "sanitize-html";

import TaskList from "./sidebar/TaskList";

interface SidebarProps {
  classes: string;
  instructions: string;
  challengeName: string;
}

export interface Task {
  id: string;
  title: string;
  hints: Array<Hint>;
}

export interface Hint {
  id: string;
  title: string;
}

const tasks: Task[] = [
  {
    id: "cae91ba0-a754-43c9-88ba-7af391563471",
    title: "Add the doctype declaration for HTML5 to the <!DOCTYPE> Element in the editor.",
    hints: [
      {
        id: "2ad77504-668f-42a4-a966-0490b3bdd30a",
        title: "The declaration for HTML5 is <!DOCTYPE html>.",
      },
      {
        id: "f96cb1da-2a52-419f-b083-e4f1eeebf17a",
        title: "There is no second hint, sorry.",
      },
    ],
  },

  {
    id: "ae058db3-6c99-42fe-bb1b-cfd5b795f657",
    title: "Go get a coffee.",
    hints: [
      {
        id: "67d294ef-dbe3-490e-8ddb-d764b9026dd0",
        title: "With Sugar.",
      },
    ],
  },
];

const Sidebar: React.FunctionComponent<SidebarProps> = ({ classes, challengeName, instructions }) => {
  return (
    <aside className={clsx("w-sidebar py-4 px-7", "container-dark", classes)}>
      <div className="flex flex-col w-full h-full">
        <h2 className={clsx("text-greyMiddle", "h6")}>{challengeName}</h2>
        <h3 className={clsx("my-8", "h4")}>Instructions</h3>
        {/* TODO: check how text comes from backend and in which tag it has to be wrapped */}
        <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(instructions) }} />
        <TaskList tasks={tasks} />
      </div>
    </aside>
  );
};

export default Sidebar;
