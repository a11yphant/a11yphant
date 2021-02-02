import React from "react";

export interface InstructionProps {
  text: string[];
  tldr: string;
  requirements: string[];
}

const Instructions: React.FunctionComponent<InstructionProps> = ({ text, tldr, requirements }) => {
  return (
    <div>
      <h3 className="text-primary font-bold p-4 mb-10 text-center">Instructions</h3>
      <div>
        {text.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <p className="text-primary font-bold mt-8">{tldr}</p>
      </div>
      <h3 className="text-primary font-bold mt-10 mb-8 text-center">Requirements</h3>
      <div>
        <ul>
          {requirements.map((requirement) => (
            <li key={requirement} className="text-primary my-2">
              {requirement}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Instructions;
