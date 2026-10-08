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
  const rule = easeOut(frame, 4, 28);

  return (
    <section
      style={{
        position: "absolute",
        left: GRID.marginX,
        right: GRID.marginX,
        top: "50%",
        height: 730,
        transform: "translateY(-50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        opacity: fadeToBlack,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 0,
          width: `${rule * 100}%`,
          height: 1,
          background: COLORS.line,
          transform: "translateX(-50%)",
        }}
      />

      <TypeReveal delay={8}>
        <div
          style={{
            fontFamily: TYPE.mono,
            fontSize: 24,
            fontWeight: 500,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: COLORS.muted,
          }}
        >
          After-party · {event.afterPartyTime}
        </div>
      </TypeReveal>

      <TypeReveal delay={16} distance={42} style={{marginTop: 58}}>
        <h3
          style={{
            margin: 0,
            fontFamily: TYPE.sans,
            fontSize: 122,
            fontWeight: 460,
            lineHeight: 0.9,
            letterSpacing: "-0.06em",
          }}
        >
          {event.afterPartyVenue}
        </h3>
      </TypeReveal>

      <TypeReveal delay={24} style={{marginTop: 34}}>
        <div
          style={{
            fontFamily: TYPE.mono,
            fontSize: 28,
            lineHeight: 1.2,
            letterSpacing: "0.035em",
            textTransform: "uppercase",
            color: COLORS.muted,
          }}
        >
          {event.afterPartyAddress}
        </div>
      </TypeReveal>

      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: 0,
          width: `${rule * 100}%`,
          height: 1,
          background: COLORS.line,
          transform: "translateX(-50%)",
        }}
      />
    </section>
  );
};
