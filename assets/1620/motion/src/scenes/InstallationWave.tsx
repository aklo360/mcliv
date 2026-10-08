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
        top: "50%",
        height: 848,
        transform: "translateY(-50%)",
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
          Format / Installation
        </div>
      </TypeReveal>
      <div style={{position: "absolute", left: 0, top: 265}}>
        <WallWave />
      </div>
    </section>
  );
};
