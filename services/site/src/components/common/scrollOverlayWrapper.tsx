import clsx from "clsx";
import React, { useCallback, useState } from "react";
import { useResizeDetector } from "react-resize-detector";

interface ScrollOverlayWrapperProps {
  className?: string;
  classNameTop?: string;
  classNameBottom?: string;
  displayTop?: boolean;
  displayBottom?: boolean;
}

const ScrollOverlayWrapper: React.FunctionComponent<ScrollOverlayWrapperProps> = ({
  children,
  className,
  classNameTop,
  classNameBottom,
  displayTop = true,
  displayBottom = true,
}) => {
  const [isVisibleBottom, setIsVisibleBottom] = useState(false);
  const [isVisibleTop, setIsVisibleTop] = useState(false);
  const wrapperRef = React.useRef<HTMLDivElement>();

  // show overlay when content is scroll-able
  React.useEffect(() => {
    if (wrapperRef.current?.scrollHeight > wrapperRef.current?.clientHeight) {
      setIsVisibleBottom(true);
    }
  }, []);

  const listenToScroll = useCallback(() => {
    // remove gradient when scrolled to bottom
    if (wrapperRef.current?.clientHeight === wrapperRef.current?.scrollHeight - Math.abs(wrapperRef.current?.scrollTop)) {
      isVisibleBottom && // to limit setting state only the first time
        setIsVisibleBottom(false);
    } else {
      setIsVisibleBottom(true);
    }

    // add gradient on top when scrolled to bottom
    if (wrapperRef.current?.scrollTop > 0) {
      setIsVisibleTop(true);
    } else {
      setIsVisibleTop(false);
    }
  }, [wrapperRef, isVisibleBottom]);

  useResizeDetector({
    targetRef: wrapperRef,
    onResize: listenToScroll,
  });

  return (
    <div onScroll={listenToScroll} ref={wrapperRef} className={className}>
      {displayTop && isVisibleTop && <div className={clsx("custom-overlay", classNameTop)} />}
      {children}
      {displayBottom && isVisibleBottom && <div className={clsx("custom-overlay", classNameBottom)} />}
    </div>
  );
};

export default ScrollOverlayWrapper;
