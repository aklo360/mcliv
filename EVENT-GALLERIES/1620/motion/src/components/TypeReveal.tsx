import type {CSSProperties, ReactNode} from "react";
import {useCurrentFrame} from "remotion";
import {revealY} from "../motion";

type TypeRevealProps = {
  children: ReactNode;
  delay?: number;
  distance?: number;
  style?: CSSProperties;
};

export const TypeReveal = ({children, delay = 0, distance = 30, style}: TypeRevealProps) => {
  const frame = useCurrentFrame();
  const reveal = revealY(frame, delay, distance);

  return (
    <div style={{overflow: "hidden", ...style}}>
      <div style={reveal}>{children}</div>
    </div>
  );
};
