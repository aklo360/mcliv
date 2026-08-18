import {useCurrentFrame} from "remotion";
import {WallWave} from "../components/WallWave";
import {TypeReveal} from "../components/TypeReveal";
import {sceneOpacity} from "../motion";
import {COLORS, GRID, TYPE} from "../tokens";

export const InstallationWave = ({duration}: {duration: number}) => {
  const frame = useCurrentFrame();

  return (
    <section
      style={{
        position: "absolute",
        left: GRID.marginX,
        right: GRID.marginX,
        top: 470,
        height: 1080,
        opacity: sceneOpacity(frame, duration, 8, 14),
      }}
    >
      <TypeReveal delay={3}>
        <div
          style={{
            fontFamily: TYPE.mono,
            fontSize: 21,
            letterSpacing: "0.11em",
            textTransform: "uppercase",
            color: COLORS.muted,
          }}
        >
          Installation System
        </div>
      </TypeReveal>
      <div style={{position: "absolute", left: 0, top: 250}}>
        <WallWave />
      </div>
      <div
        style={{
          position: "absolute",
          right: 0,
          bottom: 30,
          fontFamily: TYPE.sans,
          fontSize: 34,
          lineHeight: 1.15,
          letterSpacing: "-0.03em",
          textAlign: "right",
          color: COLORS.muted,
        }}
      >
        Signal becomes structure.
        <br />
        Structure becomes a room.
      </div>
    </section>
  );
};
