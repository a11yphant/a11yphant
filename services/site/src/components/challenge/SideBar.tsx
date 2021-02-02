interface SideBarProps {
  sections: SideBarSection[];
}

interface SideBarSection {
  title: string;
  content: SideBarContent;
}

interface SideBarContent {
  text: string[];
  tldr: string;
  requirements: string[];
}

const SideBar: React.FunctionComponent<SideBarProps> = ({ sections }) => {
  return (
    <aside className="h-screen w-1/4 border-2 rounded-lg border-primary m-4 px-8 relative box-border">
      <button className="border-l-2 border-b-2 border-primary p-4 absolute -top-px -right-px box-border text-2xl">Back</button>
      {sections.map((section) => {
        return (
          <div key={section.title}>
            <h3 className="text-primary font-bold p-4 mb-10 text-center">{section.title}</h3>
            <div>
              {section.content.text.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <p className="text-primary font-bold mt-8">{section.content.tldr}</p>
            </div>
            <h3 className="text-primary font-bold mt-10 mb-8 text-center">Requirements</h3>
            <div>
              <ul>
                {section.content.requirements.map((requirement) => (
                  <li key={requirement} className="text-primary my-2">
                    {requirement}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      })}
    </aside>
  );
};

export default SideBar;
