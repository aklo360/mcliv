import {useCurrentFrame} from "remotion";
import event from "../event-data.generated.json";
import {TypeReveal} from "../components/TypeReveal";
import {easeOut, sceneOpacity} from "../motion";
import {COLORS, GRID, TYPE} from "../tokens";

export const Opening = ({duration}: {duration: number}) => {
  const frame = useCurrentFrame();
  const opacity = sceneOpacity(frame, duration, 10, 18);
  const rule = easeOut(frame, 4, 30);

  return (
    <section
      style={{
        position: "absolute",
        left: GRID.marginX,
        right: GRID.marginX,
        top: "50%",
        height: 920,
        transform: "translateY(-50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        opacity,
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

      <TypeReveal delay={4}>
        <div
          style={{
            fontFamily: TYPE.mono,
            fontSize: 21,
            letterSpacing: "0.11em",
            textTransform: "uppercase",
            color: COLORS.muted,
          }}
        >
          Opening / Details
        </div>
      </TypeReveal>

      <TypeReveal delay={9} distance={54} style={{marginTop: 50}}>
        <h2
          style={{
            margin: 0,
            fontFamily: TYPE.sans,
            fontSize: 142,
            fontWeight: 460,
            lineHeight: 0.88,
            letterSpacing: "-0.07em",
            textTransform: "uppercase",
          }}
        >
          {event.dateShort}
        </h2>
      </TypeReveal>

      <TypeReveal delay={15} style={{marginTop: 24}}>
        <div
          style={{
            fontFamily: TYPE.sans,
            fontSize: 68,
            fontWeight: 400,
            lineHeight: 1,
            letterSpacing: "-0.05em",
          }}
        >
          {event.time}
        </div>
      </TypeReveal>

      <TypeReveal delay={24} style={{marginTop: 76}}>
        <div
          style={{
            fontFamily: TYPE.mono,
            fontSize: 20,
            letterSpacing: "0.09em",
            textTransform: "uppercase",
            color: COLORS.muted,
          }}
        >
          Free + open to the public
        </div>
      </TypeReveal>

      <TypeReveal delay={30} distance={38} style={{marginTop: 34}}>
        <h3
          style={{
            margin: 0,
            fontFamily: TYPE.sans,
            fontSize: 62,
            fontWeight: 400,
            lineHeight: 0.98,
            letterSpacing: "-0.052em",
          }}
        >
          {event.venueDetail}
        </h3>
      </TypeReveal>

      <TypeReveal delay={36} style={{marginTop: 28}}>
        <div
          style={{
            fontFamily: TYPE.mono,
            fontSize: 30,
            lineHeight: 1.28,
            letterSpacing: "0.025em",
            textTransform: "uppercase",
            color: COLORS.muted,
          }}
        >
          {event.venueFlyerName}
          <br />
          {event.venueFloor}
          <br />
          {event.venueAddress}
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
