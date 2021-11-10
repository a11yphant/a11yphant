import lottie, { AnimationConfigWithData } from "lottie-web";
import React, { HTMLAttributes, useEffect, useRef } from "react";

export interface LottieProps extends HTMLAttributes<HTMLDivElement> {
  options: Partial<AnimationConfigWithData>;
}

const Lottie: React.FunctionComponent<LottieProps> = ({ options, ...elementProps }) => {
  const wrapper = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const animation = lottie.loadAnimation({
      container: wrapper.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      ...options,
    });

    return () => {
      animation.destroy();
    };
  }, [wrapper, options]);

  return <div ref={wrapper} {...elementProps}></div>;
};

export default Lottie;
