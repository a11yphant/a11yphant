import React from "react";

import { Task } from "../Sidebar";
import HintBox from "./Sections/HintBox";

interface TaskListProps {
  tasks: Task[];
}

const TaskList: React.FunctionComponent<TaskListProps> = ({ tasks }) => {
  if (tasks.length === 1) {
    return (
      <>
        <p className="font-bold  my-6">{tasks[0]}</p>;{/* <HintBox hints={task.hints} /> */}
      </>
    );
  } else {
    return (
      <ol className="list-decimal">
        {tasks.map((task) => (
          <li key={task.id} className="font-bold my-6">
            <p>{task.title}</p>
            <HintBox hints={task.hints} />
          </li>
        ))}
      </ol>
    );
  }
};

export default TaskList;
