import { Level } from "app/generated/graphql";
import clsx from "clsx";
import React, { useState } from "react";
import sanitizeHtml from "sanitize-html";

import HintList from "./sidebar/HintList";

interface SidebarProps {
  className: string;
  challengeName: string;
  level: Pick<Level, "instructions" | "tasks">;
}

const Sidebar: React.FunctionComponent<SidebarProps> = ({ className, challengeName, level }) => {
  const [isVisibleBottom, setIsVisibleBottom] = useState(false);
  const [isVisibleTop, setIsVisibleTop] = useState(false);

  const wrapperRef = React.useRef<HTMLDivElement>();

  React.useEffect(() => {
    if (wrapperRef.current?.scrollHeight > wrapperRef.current?.clientHeight) {
      setIsVisibleBottom(true);
    }
  }, []);

  const listenToScroll = (): void => {
    // remove gradient when scrolled to bottom
    if (wrapperRef.current?.clientHeight === wrapperRef.current?.scrollHeight - Math.abs(wrapperRef.current?.scrollTop)) {
      isVisibleBottom && // to limit setting state only the first time
        setIsVisibleBottom(false);
    } else {
      setIsVisibleBottom(true);
    }

    // add gradient when scrolled to bottom
    if (wrapperRef.current?.scrollTop > 0) {
      setIsVisibleTop(true);
    } else {
      setIsVisibleTop(false);
    }
  };

  return (
    <aside className={clsx("w-sidebar py-4", "container-dark", className)}>
      <div onScroll={listenToScroll} ref={wrapperRef} className="w-full h-full px-7 flex flex-col overflow-auto">
        {isVisibleTop && <div className={clsx("w-sidebar h-28 top-20 rotate-180", "custom-overlay")} />}
        <h2 className={clsx("text-grey-middle", "h6")}>{challengeName}</h2>
        <h3 className={clsx("my-8", "h4")}>Instructions</h3>
        <p className={clsx("whitespace-pre-wrap", "prose")} dangerouslySetInnerHTML={{ __html: sanitizeHtml(level.instructions) }} />
        <HintList tasks={level.tasks} />
        {isVisibleBottom && <div className={clsx("w-sidebar h-44", "custom-overlay")} />}
      </div>
    </aside>
  );
};

export default Sidebar;
