import React from "react";

const CTRL_SHIFT_PLATFORMS = ["Macintosh", "MacIntel", "MacPPC", "Mac68K", "iPhone", "iPad", "iPod"];

function getCommandForTabModeSwitch(): "ctrl + shift" | "ctrl" {
  // there is no sign of deprecation of navigator.platform in the spec
  // https://html.spec.whatwg.org/multipage/system-state.html#dom-navigator-platform
  if (typeof navigator === "undefined" || !navigator.platform) {
    return "ctrl";
  }

  if (CTRL_SHIFT_PLATFORMS.includes(navigator.platform)) {
    return "ctrl + shift";
  }

  return "ctrl";
}

const ModeCommandHint: React.FunctionComponent = () => {
  const [commandForTabModeSwitch, setCommandForTabModeSwitch] = React.useState("");

  React.useEffect(() => {
    setCommandForTabModeSwitch(getCommandForTabModeSwitch());
  }, []);

  return (
    <p className="text-grey-middle text-right ml-8">
      <span className="sr-only">On your computer: </span>Press <span className="italic text-grey-middle">{commandForTabModeSwitch} + m</span> to use
      the tab key for site navigation.
    </p>
  );
};

export default ModeCommandHint;
