import { usePrefersReducedMotion } from "app/hooks/prefersReducedMotion";
import lottie, { AnimationConfigWithData } from "lottie-web";
import React, { HTMLAttributes, useEffect, useRef } from "react";

export interface LottieProps extends HTMLAttributes<HTMLDivElement> {
  options: Partial<AnimationConfigWithData>;
}

const Lottie: React.FunctionComponent<LottieProps> = ({ options, ...elementProps }) => {
  const prefersReducedMotion = usePrefersReducedMotion();

  const wrapper = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const animation = lottie.loadAnimation({
      container: wrapper.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      ...options,
    });

    if (prefersReducedMotion) {
      animation.goToAndStop(animation.totalFrames - 1, true);
    }

    return () => {
      animation.destroy();
    };
  }, [wrapper, options, prefersReducedMotion]);

  return <div ref={wrapper} {...elementProps}></div>;
};

export default Lottie;
