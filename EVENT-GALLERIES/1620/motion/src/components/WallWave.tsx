import {interpolate, useCurrentFrame} from "remotion";
import {easeOut} from "../motion";
import {COLORS, TYPE} from "../tokens";

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

export const WallWave = () => {
  const frame = useCurrentFrame();
  const fullFlash = frame >= 59 && frame < 62;
  const vanish = interpolate(frame, [69, 78], [1, 0], clamp);

  return (
    <div style={{width: 952}}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(9, 72px)",
          columnGap: 37,
          rowGap: 42,
          width: 944,
        }}
      >
        {Array.from({length: 27}, (_, index) => {
          const row = Math.floor(index / 9);
          const column = index % 9;
          const delay = 7 + column * 3 + row * 5;
          const on = easeOut(frame, delay, delay + 9);
          const waveOff = interpolate(frame, [delay + 28, delay + 39], [1, 0], clamp);
          const fillOpacity = fullFlash ? 1 : on * waveOff;

          return (
            <div
              key={index}
              style={{
                width: 72,
                height: 90,
                border: `1px solid ${COLORS.white}`,
                background: COLORS.white,
                opacity: Math.max(fillOpacity, 0.22) * vanish,
                boxShadow: fullFlash ? `0 0 0 1px ${COLORS.white}` : "none",
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
          opacity: vanish,
        }}
      >
        <span>03 ROWS</span>
        <span>09 WORKS / ROW</span>
        <span>27 POSITIONS</span>
      </div>
    </div>
  );
};
