import { Requirement } from "app/components/challenge/sidebar/InstructionSection";
import React from "react";

interface CheckboxListProps {
  items: Requirement[];
}

const CheckboxList: React.FunctionComponent<CheckboxListProps> = ({ items }) => {
  return (
    <ul>
      {items.map((item) => (
        <li className="my-2">
          <input className="mr-1" id={item.id} name={item.id} type="checkbox" /> <label htmlFor={item.id}>{item.title}</label>
        </li>
      ))}
    </ul>
  );
};

export default CheckboxList;
