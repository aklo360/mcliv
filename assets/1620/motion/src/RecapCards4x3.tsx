import {AbsoluteFill, Img, useCurrentFrame, useVideoConfig} from "remotion";
import logo from "../../../../public/icons/logo.svg";
import cultureClubLogo from "../../proposal/assets/nyc-culture-club-logo-official.png";
import {easeInOut, easeOut, revealY} from "./motion";
import {COLORS, TYPE} from "./tokens";

export const RecapCards4x3 = ({closing = false}: {closing?: boolean}) => {
  const frame = useCurrentFrame();
  const {width, durationInFrames} = useVideoConfig();
  const opacity = closing ? 1 : 1 - easeInOut(frame, 77, 89);
  const contentOpacity = closing
    ? 1 - easeInOut(frame, durationInFrames - 24, durationInFrames - 1)
    : 1;

  return (
    <AbsoluteFill style={{opacity, backgroundColor: COLORS.white,
      filter: closing ? "invert(1)" : undefined}}>
      <div style={{position: "absolute", width: 1440, height: 1080,
        transform: `scale(${width / 1440})`, transformOrigin: "top left",
        color: COLORS.black, fontFamily: TYPE.sans, opacity: contentOpacity,
        WebkitFontSmoothing: "antialiased", textRendering: "optimizeLegibility"}}>
        <header style={{position: "absolute", left: 86, right: 86, top: 94,
          height: 82, borderBottom: "1px solid rgba(10,10,10,0.24)",
          opacity: easeOut(frame, 0, 22)}}>
          <Img src={logo} style={{position: "absolute", left: 0, top: 15,
            width: 240, height: 52, objectFit: "contain"}} />
          <Img src={cultureClubLogo} style={{position: "absolute", right: 0,
            top: 7, width: 270, height: 68, objectFit: "contain",
            filter: "grayscale(1) brightness(0)"}} />
        </header>
        <div style={{position: "absolute", left: 86, right: 86, top: 326,
          textAlign: "center", fontFamily: TYPE.mono, fontSize: 26,
          fontWeight: 500, lineHeight: 1, letterSpacing: "0.08em",
          ...revealY(frame, 3, 18, 20)}}>SEPTEMBER 16 · NYC</div>
        <div style={{position: "absolute", left: 86, right: 86, top: 404,
          textAlign: "center"}}>
          <h1 style={{display: "inline-block", margin: 0, paddingRight: 36,
            fontSize: 480, fontWeight: 520, lineHeight: 0.88,
            letterSpacing: "-0.075em", ...revealY(frame, 8, 48, 24)}}>1620</h1>
        </div>
        <div style={{position: "absolute", left: 86, right: 86, top: 832,
          textAlign: "center", fontSize: 42, fontWeight: 500, lineHeight: 1.08,
          letterSpacing: "-0.035em", ...revealY(frame, 17, 24, 22)}}>
          A group exhibition of 18 artists
        </div>
        <div style={{position: "absolute", left: 86, right: 86, top: 940,
          height: 1, backgroundColor: "rgba(10,10,10,0.24)",
          opacity: easeOut(frame, 8, 30)}} />
      </div>
    </AbsoluteFill>
  );
};
