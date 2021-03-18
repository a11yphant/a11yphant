import { Requirement } from "app/components/challenge/sidebar/Sections/InstructionSection";
import React from "react";

interface NumberedListProps {
  items: Requirement[];
}

const NumberedList: React.FunctionComponent<NumberedListProps> = ({ items }) => {
  return (
    <ol className="list-decimal">
      {items.map((item) => (
        <li key={item.id} className="my-4 pl-2 text-primary">
          {item.title}
        </li>
      ))}
    </ol>
  );
};

export default NumberedList;
