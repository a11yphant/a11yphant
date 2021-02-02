interface SideBarProps {
  sections: SideBarSection[];
}

interface SideBarSection {
  title: string;
  content: React.ReactNode;
}

const SideBar: React.FunctionComponent<SideBarProps> = ({ sections }) => {
  return (
    <aside className="h-screen w-1/5 border-2 rounded-lg border-primary m-4 relative box-border">
      <button className="border-l-2 border-b-2 border-primary p-4 absolute -top-px -right-px box-border">Back</button>
      {sections.map((section) => {
        return (
          <div key={section.title}>
            <h3>{section.title}</h3>
            <div>{section.content}</div>
          </div>
        );
      })}
    </aside>
  );
};

export default SideBar;
