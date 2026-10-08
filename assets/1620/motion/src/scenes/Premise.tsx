import {useCurrentFrame} from "remotion";
import {CanvasGlyph} from "../components/CanvasGlyph";
import {TypeReveal} from "../components/TypeReveal";
import {easeOut, sceneOpacity} from "../motion";
import {COLORS, GRID, TYPE} from "../tokens";

export const Premise = ({duration}: {duration: number}) => {
  const frame = useCurrentFrame();
  const line = easeOut(frame, 18, 42);

  return (
    <section
      style={{
        position: "absolute",
        left: GRID.marginX,
        right: GRID.marginX,
        top: "50%",
        height: 907,
        transform: "translateY(-50%)",
        opacity: sceneOpacity(frame, duration, 12, 26),
      }}
    >
      <TypeReveal delay={6}>
        <div
          style={{
            fontFamily: TYPE.mono,
            fontSize: 21,
            letterSpacing: "0.11em",
            textTransform: "uppercase",
            color: COLORS.muted,
          }}
        >
          Premise / Format
        </div>
      </TypeReveal>

      <TypeReveal delay={13} distance={46} style={{marginTop: 42}}>
        <h2
          style={{
            margin: 0,
            maxWidth: 900,
            fontFamily: TYPE.sans,
            fontSize: 92,
            fontWeight: 400,
            lineHeight: 0.94,
            letterSpacing: "-0.058em",
          }}
        >
          One format.
          <br />
          Eighteen points
          <br />
          of view.
        </h2>
      </TypeReveal>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 414,
          height: 1,
          transformOrigin: "left",
          transform: `scaleX(${line})`,
          background: COLORS.line,
        }}
      />

      <div style={{position: "absolute", left: 72, top: 570}}>
        <CanvasGlyph width={236} delay={22} />
      </div>

      <div
        style={{
          position: "absolute",
          right: 0,
          top: 630,
          width: 444,
          fontFamily: TYPE.sans,
          fontSize: 32,
          fontWeight: 400,
          lineHeight: 1.28,
          letterSpacing: "-0.025em",
          color: COLORS.muted,
          opacity: easeOut(frame, 31, 50),
        }}
      >
        Every work shares the same physical constraint. Each artist brings a distinct point of view.
      </div>
    </section>
  );
};
