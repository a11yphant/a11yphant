import React, { useState } from "react";

interface TabBarOption {
  id: string | number;
  label: string;
  onClick: () => void;
}

interface TabBarProps {
  activeId: string | number;
  options: TabBarOption[];
}

const TabBar: React.FunctionComponent<TabBarProps> = ({ activeId, options }) => {
  const [active, setActive] = useState<string | number>(activeId);

  const handleClick = (id, callback?: () => void) => {
    setActive(id);
    callback?.();
  };

  return (
    <div className="hidden sm:block">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {options.map((option) => (
            <button
              className={
                option.id === active
                  ? "border-indigo-500 text-indigo-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
              }
              aria-current={option.id === active ? "page" : null}
              onClick={() => handleClick(option.id, option.onClick)}
            >
              {option.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default TabBar;
