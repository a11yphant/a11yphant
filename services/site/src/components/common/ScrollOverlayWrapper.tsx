import clsx from "clsx";
import React, { useState } from "react";
import { useResizeDetector } from "react-resize-detector";

export interface ScrollOverlayWrapperProps {
  className?: string;
  classNameTopOverlay?: string;
  classNameBottomOverlay?: string;
  enableTopOverlay?: boolean;
  enableBottomOverlay?: boolean;
  attachScrollListenerToDocument?: boolean;
}

const ScrollOverlayWrapper: React.FunctionComponent<ScrollOverlayWrapperProps> = ({
  children,
  className,
  classNameTopOverlay,
  classNameBottomOverlay,
  enableTopOverlay = true,
  enableBottomOverlay = true,
  attachScrollListenerToDocument = false,
}) => {
  const [showBottomOverlay, setShowBottomOverlay] = useState(false);
  const [showTopOverlay, setShowTopOverlay] = useState(false);
  const wrapperRef = React.useRef<HTMLDivElement>();

  React.useEffect(() => {
    const element = attachScrollListenerToDocument ? document.documentElement : wrapperRef.current;
    if (element.scrollHeight > element.clientHeight) {
      setShowBottomOverlay(true);
    }
  }, []);

  const listenToScroll = React.useCallback(() => {
    const element = attachScrollListenerToDocument ? document.documentElement : wrapperRef.current;
    const containerHeight = element.clientHeight;
    const scrollableHeight = element.scrollHeight;
    const scrollDistanceToTop = element.scrollTop;
    const isScrolledToBottom = Math.abs(scrollableHeight - (containerHeight + scrollDistanceToTop)) < 1;

    setShowBottomOverlay(!isScrolledToBottom);
    setShowTopOverlay(scrollDistanceToTop > 0);
  }, [attachScrollListenerToDocument]);

  React.useEffect(() => {
    if (!attachScrollListenerToDocument) {
      return;
    }

    document.addEventListener("scroll", listenToScroll);

    return () => document.removeEventListener("scroll", listenToScroll);
  }, [attachScrollListenerToDocument, listenToScroll]);

  useResizeDetector({
    targetRef: wrapperRef,
    onResize: listenToScroll,
  });

  const scrollOverLayClasses = clsx("sticky w-full left-0 border-0 from-background pointer-events-none", "transition-opacity");

  return (
    <div
      onScroll={!attachScrollListenerToDocument ? listenToScroll : undefined}
      ref={wrapperRef}
      className={clsx(!attachScrollListenerToDocument && "relative overflow-auto scroll-smooth", className)}
    >
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
