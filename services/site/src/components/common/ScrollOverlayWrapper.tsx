import clsx from "clsx";
import React, { useState } from "react";
import { useResizeDetector } from "react-resize-detector";

export interface ScrollOverlayWrapperProps {
  className?: string;
  classNameTopOverlay?: string;
  classNameBottomOverlay?: string;
  enableTopOverlay?: boolean;
  enableBottomOverlay?: boolean;
}

const ScrollOverlayWrapper: React.FunctionComponent<ScrollOverlayWrapperProps> = ({
  children,
  className,
  classNameTopOverlay,
  classNameBottomOverlay,
  enableTopOverlay = true,
  enableBottomOverlay = true,
}) => {
  const [showBottomOverlay, setShowBottomOverlay] = useState(false);
  const [showTopOverlay, setShowTopOverlay] = useState(false);
  const wrapperRef = React.useRef<HTMLDivElement>();

  // show overlay when content is scroll-able
  React.useEffect(() => {
    if (wrapperRef.current?.scrollHeight > wrapperRef.current?.clientHeight) {
      setShowBottomOverlay(true);
    }
  }, []);

  const listenToScroll = (): void => {
    // remove gradient when scrolled to bottom
    const containerHeight = wrapperRef.current?.clientHeight;
    const scrollableHeight = wrapperRef.current?.scrollHeight;
    const scrollDistanceToTop = wrapperRef.current?.scrollTop;
    const isScrolledToBottom = containerHeight === scrollableHeight - scrollDistanceToTop;

    setShowBottomOverlay(!isScrolledToBottom);
    setShowTopOverlay(scrollDistanceToTop > 0);
  };

  useResizeDetector({
    targetRef: wrapperRef,
    onResize: listenToScroll,
  });

  const scrollOverLayClasses = clsx("sticky w-full left-0 border-0 from-background pointer-events-none", "transition-opacity");

  return (
    <div onScroll={listenToScroll} ref={wrapperRef} className={clsx("relative overflow-auto scroll-smooth", className)}>
      {enableTopOverlay && (
        <div className={clsx("top-0 bg-gradient-to-b", scrollOverLayClasses, classNameTopOverlay, showTopOverlay ? "opacity-100" : "opacity-0")} />
      )}
      {children}
      {enableBottomOverlay && (
        <div
          className={clsx("bottom-0 bg-gradient-to-t", scrollOverLayClasses, classNameBottomOverlay, showBottomOverlay ? "opacity-100" : "opacity-0")}
        />
      )}
    </div>
  );
};

export default ScrollOverlayWrapper;
