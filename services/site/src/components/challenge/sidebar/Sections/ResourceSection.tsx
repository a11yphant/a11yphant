import React from "react";

export interface Resource {
  label: string;
  link: string;
}

interface ResourceSectionProps {
  resources: Resource[];
}

const ResourceSection: React.FunctionComponent<ResourceSectionProps> = ({ resources }) => {
  return (
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
  );
};

export default ResourceSection;
