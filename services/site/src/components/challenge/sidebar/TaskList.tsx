import { Task } from "app/generated/graphql";
import clsx from "clsx";
import React from "react";
import sanitizeHtml from "sanitize-html";

import HintBox from "./HintBox";

interface TaskListProps {
  tasks: Task[];
}

const TaskList: React.FunctionComponent<TaskListProps> = ({ tasks }) => {
  if (tasks.length === 1) {
    return (
      <>
        <p className={clsx("font-bold my-6", "prose")} dangerouslySetInnerHTML={{ __html: sanitizeHtml(tasks[0].text) }} />
        <HintBox hints={tasks[0].hints} />
      </>
    );
  } else {
    return (
      <ol>
        {tasks.map((task, idx) => (
          <li key={task.id} className="font-bold my-6">
            <p dangerouslySetInnerHTML={{ __html: sanitizeHtml(`${idx + 1}. ${task.text}`) }} />
            <HintBox hints={task.hints} />
          </li>
        ))}
      </ol>
    );
  }
};

export default TaskList;
