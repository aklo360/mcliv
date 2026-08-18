import {useCurrentFrame} from "remotion";
import event from "../event-data.generated.json";
import {CanvasGlyph} from "../components/CanvasGlyph";
import {TypeReveal} from "../components/TypeReveal";
import {easeOut, sceneOpacity} from "../motion";
import {COLORS, GRID, TYPE} from "../tokens";

export const Opening = ({duration}: {duration: number}) => {
  const frame = useCurrentFrame();
  const opacity = sceneOpacity(frame, duration, 10, 18);
  const divider = easeOut(frame, 18, 42);

  return (
    <section
      style={{
        position: "absolute",
        left: GRID.marginX,
        right: GRID.marginX,
        top: 430,
        height: 1150,
        opacity,
      }}
    >
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
          Opening / Location
        </div>
      </TypeReveal>

      <TypeReveal delay={9} distance={54} style={{marginTop: 40}}>
        <h2
          style={{
            margin: 0,
            fontFamily: TYPE.sans,
            fontSize: 152,
            fontWeight: 400,
            lineHeight: 0.88,
            letterSpacing: "-0.07em",
            textTransform: "uppercase",
          }}
        >
          Sep 16
        </h2>
      </TypeReveal>

      <TypeReveal delay={15} style={{marginTop: 26}}>
        <div
          style={{
            fontFamily: TYPE.sans,
            fontSize: 74,
            fontWeight: 400,
            lineHeight: 1,
            letterSpacing: "-0.05em",
          }}
        >
          {event.time}
        </div>
      </TypeReveal>

      <div
        style={{
          marginTop: 58,
          height: 1,
          width: `${divider * 100}%`,
          background: COLORS.line,
        }}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 255px",
          columnGap: 86,
          marginTop: 62,
          minHeight: 480,
        }}
      >
        <div style={{opacity: easeOut(frame, 27, 46)}}>
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
          <h3
            style={{
              margin: "48px 0 0",
              fontFamily: TYPE.sans,
              fontSize: 68,
              fontWeight: 400,
              lineHeight: 0.98,
              letterSpacing: "-0.052em",
            }}
          >
            {event.venueDetail}
          </h3>
          <div
            style={{
              marginTop: 32,
              fontFamily: TYPE.sans,
              fontSize: 39,
              lineHeight: 1.18,
              letterSpacing: "-0.03em",
              color: COLORS.muted,
            }}
          >
            Port Authority
            <br />
            {event.venueFloor}
            <br />
            {event.venueAddress}
          </div>
        </div>
        <div style={{paddingTop: 40}}>
          <CanvasGlyph width={220} delay={33} />
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          borderTop: `1px solid ${COLORS.line}`,
          paddingTop: 20,
          display: "flex",
          justifyContent: "space-between",
          fontFamily: TYPE.mono,
          fontSize: 20,
          letterSpacing: "0.08em",
          color: COLORS.muted,
          opacity: easeOut(frame, 52, 68),
        }}
      >
        <span>GROUP EXHIBITION</span>
        <span>{event.date.toUpperCase()} · {event.time}</span>
      </div>
    </section>
  );
};
