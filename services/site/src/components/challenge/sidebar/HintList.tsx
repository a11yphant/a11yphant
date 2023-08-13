import { Task } from "app/generated/graphql";
import clsx from "clsx";
import React from "react";
import sanitizeHtml from "sanitize-html";

import HintBox from "./HintBox";

interface HintListProps {
  tasks: Task[];
}

const HintList: React.FunctionComponent<HintListProps> = ({ tasks }) => {
  if (tasks.length === 1) {
    return (
      <>
        <div
          className={clsx("font-bold mt-4 mb-8 md:mt-10 inline-block", "prose")}
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(tasks[0].text) }}
        />
        <HintBox hints={tasks[0].hints} />
      </>
    );
  } else {
    return (
      <ol>
        {tasks.map((task, idx) => (
          <li key={task.id} className={clsx("font-bold my-6")}>
            <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(`${idx + 1}. ${task.text}`) }} />
            <HintBox hints={task.hints} />
          </li>
        ))}
      </ol>
    );
  }
};

export default HintList;
