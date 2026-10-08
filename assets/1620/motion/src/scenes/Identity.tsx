import {Img, interpolate, useCurrentFrame} from "remotion";
import heroImage from "../../../venue-installed-nb2-v006-smaller-guided/PC_00515_16X20_CANVAS_INSTALL_SMALLER_NBPRO_4K_v006.jpg";
import event from "../event-data.generated.json";
import {TypeReveal} from "../components/TypeReveal";
import {easeOut, sceneOpacity} from "../motion";
import {COLORS, GRID, TYPE} from "../tokens";

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

export const Identity = ({duration}: {duration: number}) => {
  const frame = useCurrentFrame();
  const opacity = sceneOpacity(frame, duration, 20, 18);
  const imageScale = interpolate(frame, [0, 92], [1.04, 1], clamp);
  const rule = easeOut(frame, 20, 54);

  return (
    <section style={{position: "absolute", inset: 0, opacity}}>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: GRID.safeTop,
          height: GRID.safeBottom - GRID.safeTop,
          overflow: "hidden",
          background: COLORS.black,
        }}
      >
        <Img
          src={heroImage}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "49% 54%",
            filter: "grayscale(1) contrast(1.04)",
            transform: `scale(${imageScale})`,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(10,10,10,0.34) 0%, rgba(10,10,10,0.03) 35%, rgba(10,10,10,0.12) 58%, rgba(10,10,10,0.92) 100%)",
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: GRID.marginX,
          right: GRID.marginX,
          top: 1160,
          height: 390,
          display: "grid",
          gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
          columnGap: 28,
          alignItems: "end",
        }}
      >
        <div style={{gridColumn: "1 / 8"}}>
          <TypeReveal delay={8} duration={24}>
            <div
              style={{
                marginBottom: 28,
                fontFamily: TYPE.mono,
                fontSize: 24,
                fontWeight: 500,
                lineHeight: 1,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              {event.date} · {event.time}
            </div>
          </TypeReveal>
          <TypeReveal delay={14} distance={48} duration={30} style={{paddingBottom: 16}}>
            <h1
              style={{
                margin: "0 0 0 -8px",
                fontFamily: TYPE.sans,
                fontSize: 220,
                fontWeight: 520,
                lineHeight: 0.88,
                letterSpacing: "-0.075em",
              }}
            >
              {event.title}
            </h1>
          </TypeReveal>
        </div>

        <TypeReveal
          delay={28}
          distance={28}
          duration={26}
          style={{gridColumn: "8 / 13"}}
        >
          <h2
            style={{
              margin: 0,
              fontFamily: TYPE.sans,
              fontSize: 40,
              fontWeight: 500,
              lineHeight: 1.08,
              letterSpacing: "-0.035em",
              textAlign: "right",
            }}
          >
            A group exhibition of 18 artists
          </h2>
        </TypeReveal>

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: -64,
            height: 1,
            transformOrigin: "left",
            transform: `scaleX(${rule})`,
            background: COLORS.line,
          }}
        />
      </div>
    </section>
  );
};
