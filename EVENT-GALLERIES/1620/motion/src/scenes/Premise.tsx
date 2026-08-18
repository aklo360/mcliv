import {useCurrentFrame} from "remotion";
import {CanvasGlyph} from "../components/CanvasGlyph";
import {TypeReveal} from "../components/TypeReveal";
import {easeOut, sceneOpacity} from "../motion";
import {COLORS, GRID, TYPE} from "../tokens";

export const Premise = ({duration}: {duration: number}) => {
  const frame = useCurrentFrame();
  const opacity = sceneOpacity(frame, duration, 12, 18);
  const line = easeOut(frame, 18, 42);

  return (
    <section
      style={{
        position: "absolute",
        left: GRID.marginX,
        right: GRID.marginX,
        top: 455,
        height: 1100,
        opacity,
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
            fontSize: 100,
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
          top: 435,
          height: 1,
          transformOrigin: "left",
          transform: `scaleX(${line})`,
          background: COLORS.line,
        }}
      />

      <div style={{position: "absolute", left: 70, top: 590}}>
        <CanvasGlyph width={248} delay={22} />
      </div>

      <div
        style={{
          position: "absolute",
          right: 0,
          top: 650,
          width: 470,
          fontFamily: TYPE.sans,
          fontSize: 35,
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
