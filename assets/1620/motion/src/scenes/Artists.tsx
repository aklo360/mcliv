import {useCurrentFrame} from "remotion";
import event from "../event-data.generated.json";
import {TypeReveal} from "../components/TypeReveal";
import {easeOut, sceneOpacity} from "../motion";
import {COLORS, GRID, TYPE} from "../tokens";

const columns = [event.artists.slice(0, 9), event.artists.slice(9, 18)];

export const Artists = ({duration}: {duration: number}) => {
  const frame = useCurrentFrame();
  const opacity = sceneOpacity(frame, duration, 9, 18);

  return (
    <section
      style={{
        position: "absolute",
        left: GRID.marginX,
        right: GRID.marginX,
        top: "50%",
        height: 872,
        transform: "translateY(-50%)",
        opacity,
      }}
    >
      <TypeReveal delay={4} distance={42}>
        <div
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            borderTop: `1px solid ${COLORS.line}`,
            borderBottom: `1px solid ${COLORS.line}`,
            fontFamily: TYPE.mono,
            fontSize: 22,
            fontWeight: 500,
            lineHeight: 1,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          Artists
        </div>
      </TypeReveal>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          columnGap: 72,
          marginTop: 34,
        }}
      >
        {columns.map((column, columnIndex) => (
          <div key={columnIndex}>
            {column.map((artist, rowIndex) => {
              const number = columnIndex * 9 + rowIndex + 1;
              const delay = 17 + rowIndex * 7 + columnIndex * 3;
              const reveal = easeOut(frame, delay, delay + 15);

              return (
                <div
                  key={artist}
                  style={{
                    height: 86,
                    display: "grid",
                    gridTemplateColumns: "54px 1fr",
                    alignItems: "center",
                    borderTop: `1px solid ${COLORS.lineQuiet}`,
                    opacity: reveal,
                    transform: `translateY(${(1 - reveal) * 18}px)`,
                  }}
                >
                  <span
                    style={{
                      fontFamily: TYPE.mono,
                      fontSize: 19,
                      letterSpacing: "0.04em",
                      color: COLORS.quiet,
                    }}
                  >
                    {String(number).padStart(2, "0")}
                  </span>
                  <span
                    style={{
                      fontFamily: TYPE.sans,
                      fontSize: artist.length > 20 ? 30 : artist.length > 16 ? 33 : 36,
                      fontWeight: 400,
                      lineHeight: 1,
                      letterSpacing: "-0.035em",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {artist}
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </div>

    </section>
  );
};
