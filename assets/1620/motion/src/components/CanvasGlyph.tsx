import {useCurrentFrame} from "remotion";
import {easeOut} from "../motion";
import {COLORS, TYPE} from "../tokens";

type CanvasGlyphProps = {
  width?: number;
  label?: boolean;
  delay?: number;
};

export const CanvasGlyph = ({width = 240, label = true, delay = 0}: CanvasGlyphProps) => {
  const frame = useCurrentFrame();
  const progress = easeOut(frame, delay, delay + 22);
  const height = width * 1.25;
  const tick = 20;

  return (
    <div style={{position: "relative", width, height, opacity: progress}}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <rect
          x="1"
          y="1"
          width={width - 2}
          height={height - 2}
          fill="none"
          stroke={COLORS.white}
          strokeWidth="2"
          pathLength="1"
          strokeDasharray="1"
          strokeDashoffset={1 - progress}
        />
        <line x1={width / 2} y1={-tick} x2={width / 2} y2={tick} stroke={COLORS.line} />
        <line
          x1={width / 2}
          y1={height - tick}
          x2={width / 2}
          y2={height + tick}
          stroke={COLORS.line}
        />
        <line x1={-tick} y1={height / 2} x2={tick} y2={height / 2} stroke={COLORS.line} />
        <line
          x1={width - tick}
          y1={height / 2}
          x2={width + tick}
          y2={height / 2}
          stroke={COLORS.line}
        />
      </svg>
      {label ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: -42,
            fontFamily: TYPE.mono,
            fontSize: 21,
            letterSpacing: "0.08em",
            textAlign: "center",
            color: COLORS.muted,
          }}
        >
          16 × 20 IN.
        </div>
      ) : null}
    </div>
  );
};
