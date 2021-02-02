import { SectionType } from "app/components/challenge/SideBar";
import React, { SetStateAction } from "react";

export interface Resource {
  label: string;
  link: string;
}

interface ResourcesProps {
  resources: Resource[];
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<SectionType>>;
}

const Resources: React.FunctionComponent<ResourcesProps> = ({ resources, open, setOpen }) => {
  return (
    <div>
      <h3
        onClick={() => setOpen(SectionType.resources)}
        className="flex text-primary font-bold items-center justify-center h-16 border-t-2 border-primary"
      >
        Resources
      </h3>
      {open && (
        <div className="sidebar__content mt-10 ">
          <ul>
            {resources.map((resource) => (
              <li>
                {resource.label}
                <a href={resource.link} target="_blank">
                  {resource.link}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Resources;
