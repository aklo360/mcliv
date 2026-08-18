import {Img, interpolate, useCurrentFrame} from "remotion";
import mclivLogo from "../../../../../public/icons/logo.svg";
import cultureClubLogo from "../../../proposal/assets/nyc-culture-club-logo-official.png";
import {easeOut} from "../motion";
import {COLORS, GRID, TYPE} from "../tokens";

const lineClamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

export const FrameArchitecture = () => {
  const frame = useCurrentFrame();
  const line = easeOut(frame, 0, 24);
  const closing = interpolate(frame, [526, 540], [1, 0], lineClamp);
  const scanY = interpolate(frame, [0, 540], [96, 1824], lineClamp);

  return (
    <div style={{position: "absolute", inset: 0, opacity: closing}}>
      <div
        style={{
          position: "absolute",
          left: GRID.marginX,
          top: 76,
          width: (GRID.width - GRID.marginX * 2) * line,
          height: 1,
          background: COLORS.lineQuiet,
        }}
      />
      <div
        style={{
          position: "absolute",
          right: GRID.marginX,
          bottom: 76,
          width: (GRID.width - GRID.marginX * 2) * line,
          height: 1,
          background: COLORS.lineQuiet,
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 31,
          top: GRID.safeTop,
          width: 1,
          height: GRID.safeBottom - GRID.safeTop,
          background: COLORS.lineQuiet,
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 31,
          top: GRID.safeTop,
          width: 1,
          height: GRID.safeBottom - GRID.safeTop,
          background: COLORS.lineQuiet,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 24,
          top: scanY,
          width: 16,
          height: 1,
          background: COLORS.white,
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 24,
          top: 1920 - scanY,
          width: 16,
          height: 1,
          background: COLORS.white,
        }}
      />
    </div>
  );
};

export const ArchiveHeader = () => {
  const frame = useCurrentFrame();
  const reveal = easeOut(frame, 5, 25);
  const closing = interpolate(frame, [526, 540], [1, 0], lineClamp);
  const opacity = reveal * closing;

  return (
    <header
      style={{
        position: "absolute",
        left: GRID.marginX,
        right: GRID.marginX,
        top: GRID.headerTop,
        height: GRID.headerHeight,
        zIndex: 100,
      }}
    >
      <Img
        src={mclivLogo}
        style={{
          position: "absolute",
          left: 0,
          top: 15,
          width: 240,
          height: 52,
          objectFit: "contain",
          objectPosition: "left center",
          filter: "invert(1)",
          opacity,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 31,
          transform: "translateX(-50%)",
          fontFamily: TYPE.mono,
          fontSize: 20,
          lineHeight: 1,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          textAlign: "center",
          color: COLORS.muted,
          opacity,
          whiteSpace: "nowrap",
        }}
      >
        Group Exhibition
      </div>
      <Img
        src={cultureClubLogo}
        style={{
          position: "absolute",
          right: 0,
          top: 7,
          width: 270,
          height: 68,
          objectFit: "contain",
          objectPosition: "right center",
          filter: "grayscale(1) brightness(0) invert(1)",
          opacity,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: 0,
          width: `${reveal * 100}%`,
          height: 1,
          background: COLORS.line,
          transform: "translateX(-50%)",
          opacity: closing,
        }}
      />
    </header>
  );
};
