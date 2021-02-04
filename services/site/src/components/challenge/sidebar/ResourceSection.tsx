import { SectionType } from "app/components/challenge/SideBar";
import ToggleButton from "app/components/challenge/sidebar/ToggleButton";
import React, { SetStateAction } from "react";

export interface Resource {
  label: string;
  link: string;
}

interface ResourceSectionProps {
  resources: Resource[];
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<SectionType>>;
}

const ResourceSection: React.FunctionComponent<ResourceSectionProps> = ({ resources, open, setOpen }) => {
  return (
    <>
      <h3 className={`${open === true ? "disableBtn" : ""} flex items-center justify-center h-16 border-t-2 border-primary`}>
        <ToggleButton onClick={() => setOpen(SectionType.resources)} text="Resources" disabled={open} />
      </h3>
      {open && (
        <div className="flex-auto overflow-y-auto mt-10 px-8">
          <ul>
            {resources.map((resource) => (
              <li className="text-primary mb-4">
                {resource.label}
                <br />
                <a href={resource.link} target="_blank" className="text-black border-primary border-b-2 break-all">
                  {resource.link}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default ResourceSection;
