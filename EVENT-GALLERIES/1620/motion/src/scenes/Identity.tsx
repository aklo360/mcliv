import {useCurrentFrame} from "remotion";
import event from "../event-data.generated.json";
import {easeOut, sceneOpacity} from "../motion";
import {COLORS, GRID, TYPE} from "../tokens";
import {TypeReveal} from "../components/TypeReveal";

export const Identity = ({duration}: {duration: number}) => {
  const frame = useCurrentFrame();
  const opacity = sceneOpacity(frame, duration, 10, 16);
  const rule = easeOut(frame, 22, 48);

  return (
    <section
      style={{
        position: "absolute",
        left: GRID.marginX,
        right: GRID.marginX,
        top: 450,
        bottom: 320,
        opacity,
      }}
    >
      <TypeReveal delay={8}>
        <div
          style={{
            fontFamily: TYPE.mono,
            fontSize: 28,
            lineHeight: 1.2,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: COLORS.muted,
          }}
        >
          {event.date} · {event.time}
        </div>
      </TypeReveal>

      <TypeReveal delay={14} distance={62}>
        <h1
          style={{
            margin: "54px 0 0",
            fontFamily: TYPE.sans,
            fontSize: 276,
            fontWeight: 500,
            lineHeight: 0.78,
            letterSpacing: "-0.075em",
            transform: "translateX(-13px)",
          }}
        >
          {event.title}
        </h1>
      </TypeReveal>

      <div
        style={{
          marginTop: 78,
          width: `${rule * 100}%`,
          height: 1,
          background: COLORS.line,
        }}
      />

      <TypeReveal delay={31} style={{marginTop: 52, maxWidth: 840}}>
        <p
          style={{
            margin: 0,
            fontFamily: TYPE.sans,
            fontSize: 58,
            fontWeight: 400,
            lineHeight: 1.03,
            letterSpacing: "-0.045em",
          }}
        >
          A group exhibition of 18 artists
          <br />
          presented by MCLIV
        </p>
      </TypeReveal>

      <div
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          fontFamily: TYPE.mono,
          fontSize: 20,
          lineHeight: 1.3,
          letterSpacing: "0.09em",
          color: COLORS.quiet,
          opacity: easeOut(frame, 48, 64),
        }}
      >
        NYC / 1620
        <br />
        ONE FORMAT / MANY SIGNALS
      </div>
    </section>
  );
};
