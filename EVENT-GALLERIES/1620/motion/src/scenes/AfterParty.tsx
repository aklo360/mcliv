import {interpolate, useCurrentFrame} from "remotion";
import event from "../event-data.generated.json";
import {TypeReveal} from "../components/TypeReveal";
import {easeOut} from "../motion";
import {COLORS, GRID, TYPE} from "../tokens";

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

export const AfterParty = ({duration}: {duration: number}) => {
  const frame = useCurrentFrame();
  const fadeToBlack = interpolate(frame, [duration - 14, duration], [1, 0], clamp);

  return (
    <section
      style={{
        position: "absolute",
        left: GRID.marginX,
        right: GRID.marginX,
        top: 440,
        height: 1130,
        opacity: fadeToBlack,
      }}
    >
      <TypeReveal delay={3}>
        <div
          style={{
            fontFamily: TYPE.mono,
            fontSize: 24,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: COLORS.muted,
          }}
        >
          After-party
        </div>
      </TypeReveal>

      <TypeReveal delay={8} distance={64} style={{marginTop: 46}}>
        <h2
          style={{
            margin: 0,
            fontFamily: TYPE.sans,
            fontSize: 220,
            fontWeight: 400,
            lineHeight: 0.8,
            letterSpacing: "-0.075em",
          }}
        >
          {event.afterPartyTime}
        </h2>
      </TypeReveal>

      <div
        style={{
          marginTop: 76,
          height: 1,
          width: `${easeOut(frame, 18, 39) * 100}%`,
          background: COLORS.line,
        }}
      />

      <TypeReveal delay={22} distance={42} style={{marginTop: 58}}>
        <h3
          style={{
            margin: 0,
            fontFamily: TYPE.sans,
            fontSize: 114,
            fontWeight: 400,
            lineHeight: 0.9,
            letterSpacing: "-0.06em",
            textTransform: "uppercase",
          }}
        >
          {event.afterPartyVenue}
        </h3>
      </TypeReveal>

      <TypeReveal delay={28} style={{marginTop: 40}}>
        <div
          style={{
            fontFamily: TYPE.sans,
            fontSize: 39,
            lineHeight: 1.2,
            letterSpacing: "-0.03em",
            color: COLORS.muted,
          }}
        >
          {event.afterPartyAddress}
        </div>
      </TypeReveal>

      <div
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          fontFamily: TYPE.mono,
          fontSize: 19,
          letterSpacing: "0.09em",
          color: COLORS.quiet,
          opacity: easeOut(frame, 53, 68),
        }}
      >
        1620 / NYC / MCLIV
      </div>
    </section>
  );
};
