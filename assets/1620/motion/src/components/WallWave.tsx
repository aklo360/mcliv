import {Easing, interpolate, useCurrentFrame} from "remotion";
import event from "../event-data.generated.json";
import {easeOut} from "../motion";
import {COLORS, TYPE} from "../tokens";

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

export const WallWave = () => {
  const frame = useCurrentFrame();
  const exit = interpolate(frame, [78, 94], [1, 0], {
    ...clamp,
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  const labels = easeOut(frame, 4, 18) * exit;

  return (
    <div style={{width: 952}}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${event.worksPerWall}, 112px)`,
          columnGap: 56,
          rowGap: 42,
          width: 952,
        }}
      >
        {Array.from({length: event.wallCount * event.worksPerWall}, (_, index) => {
          const row = Math.floor(index / event.worksPerWall);
          const column = index % event.worksPerWall;
          const delay = 10 + column * 4 + row * 6;
          const rise = interpolate(frame, [delay, delay + 12], [0, 1], {
            ...clamp,
            easing: Easing.bezier(0.22, 1, 0.36, 1),
          });
          const fall = interpolate(frame, [delay + 24, delay + 40], [1, 0], {
            ...clamp,
            easing: Easing.bezier(0.4, 0, 0.2, 1),
          });
          const pulse = Math.min(rise, fall);

          return (
            <div
              key={index}
              style={{
                width: 112,
                height: 140,
                border: `1px solid ${COLORS.white}`,
                background: COLORS.white,
                opacity: (0.16 + pulse * 0.84) * exit,
              }}
            />
          );
        })}
      </div>
      <div
        style={{
          marginTop: 54,
          display: "flex",
          justifyContent: "space-between",
          fontFamily: TYPE.mono,
          fontSize: 20,
          letterSpacing: "0.08em",
          color: COLORS.muted,
          opacity: labels,
        }}
      >
        <span>03 WALLS</span>
        <span>06 WORKS / WALL</span>
        <span>18 TOTAL WORKS</span>
      </div>
    </div>
  );
};
