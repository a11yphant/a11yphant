import { SectionType } from "app/components/challenge/SideBar";
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
      <h3
        onClick={() => setOpen(SectionType.resources)}
        className="flex text-primary font-bold items-center justify-center h-16 border-t-2 border-primary"
      >
        Resources
      </h3>
      {open && (
        <div className="mt-10 ">
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
    </>
  );
};

export default ResourceSection;
