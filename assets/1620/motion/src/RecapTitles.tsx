import {AbsoluteFill, Img, useCurrentFrame, useVideoConfig} from "remotion";
import logo from "../../../../public/icons/logo.svg";
import cultureClubLogo from "../../proposal/assets/nyc-culture-club-logo-official.png";
import {TypeReveal} from "./components/TypeReveal";
import {easeInOut, easeOut, revealY, sceneOpacity} from "./motion";
import {COLORS, TYPE} from "./tokens";

// The motion flyer's header, twelve-column title split and type hierarchy.
// The standalone card holds its type until the white fades into the entrance.
// One parent opacity keeps text, logos and white on the same fade curve.
export const RecapWhiteOpening = ({standalone = false, closing = false}: {
  standalone?: boolean;
  closing?: boolean;
}) => {
  const frame = useCurrentFrame();
  const {width, height, durationInFrames} = useVideoConfig();
  const portrait = height > width;
  const scale = width / (portrait ? 1080 : 1920);
  const canvasHeight = height / scale;
  const margin = portrait ? 64 : 114;
  const headerTop = portrait ? 180 : 130;
  const opacity = closing ? 1 : 1 - easeInOut(frame, standalone ? 77 : 28, standalone ? 89 : 76);
  const contentOpacity = closing ? 1 - easeInOut(frame, durationInFrames - 24, durationInFrames - 1) : 1;
  const reveal = (delay: number, distance = 18, duration = 20) =>
    standalone ? revealY(frame, delay, distance, duration) : {};

  return (
    <AbsoluteFill style={{opacity, backgroundColor: COLORS.white,
      filter: closing ? "invert(1)" : undefined}}>
      <div style={{position: "absolute", width: width / scale, height: canvasHeight,
        transform: `scale(${scale})`, transformOrigin: "top left",
        color: COLORS.black, fontFamily: TYPE.sans, opacity: contentOpacity,
        WebkitFontSmoothing: "antialiased", textRendering: "optimizeLegibility"}}>
        <header style={{position: "absolute", left: margin, right: margin,
          top: headerTop, height: 82, borderBottom: "1px solid rgba(10,10,10,0.24)",
          opacity: standalone ? easeOut(frame, 0, 22) : 1}}>
          <Img src={logo} style={{position: "absolute", left: 0, top: 15,
            width: 240, height: 52, objectFit: "contain"}} />
          <div style={{position: "absolute", left: "50%", top: 31,
            transform: "translateX(-50%)", fontFamily: TYPE.mono,
            fontSize: 20, lineHeight: 1, letterSpacing: "0.1em",
            whiteSpace: "nowrap"}}>GROUP EXHIBITION</div>
          <Img src={cultureClubLogo} style={{position: "absolute", right: 0,
            top: 7, width: 270, height: 68, objectFit: "contain",
            filter: "grayscale(1) brightness(0)"}} />
        </header>
        <div style={{position: "absolute", left: margin, right: margin,
          ...(portrait ? {top: "50%", height: 680, transform: "translateY(-50%)"} : {bottom: 206}),
          display: portrait ? "block" : "grid",
          gridTemplateColumns: "repeat(12, minmax(0, 1fr))", columnGap: 28,
          alignItems: "end", paddingBottom: 48,
          borderBottom: `1px solid rgba(10,10,10,${0.24 * (standalone ? easeOut(frame, 8, 30) : 1)})`}}>
          <div style={{gridColumn: "1 / 8", ...(portrait ? {position: "absolute", inset: 0, textAlign: "center"} : {})}}>
            <div style={{marginBottom: 28, fontFamily: TYPE.mono, fontSize: 24,
              fontWeight: 500, lineHeight: 1, letterSpacing: "0.08em",
              ...(portrait ? {position: "absolute", top: 132, width: "100%"} : {}),
              ...reveal(3)}}>SEPTEMBER 16 · NYC</div>
            <div style={portrait ? {position: "absolute", top: 340, width: "100%", transform: "translateY(-50%)"} : {}}>
            <h1 style={{margin: portrait ? 0 : "0 0 0 -8px", paddingBottom: 16,
              fontSize: portrait ? 300 : 260, fontWeight: 520,
              lineHeight: 0.88, letterSpacing: "-0.075em",
              ...reveal(8, 48, 24)}}>1620</h1>
            </div>
          </div>
          {/* Keep the approved subtitle position after removing the duplicate venue line. */}
          <div style={{gridColumn: "8 / 13", paddingBottom: portrait ? 0 : 71,
            textAlign: portrait ? "center" : "right",
            ...(portrait ? {position: "absolute", top: 520, width: "100%"} : {})}}>
            <div style={{fontSize: 40, fontWeight: 500, lineHeight: 1.08,
              letterSpacing: "-0.035em", ...reveal(17, 24, 22)}}>A group exhibition<br />of 18 artists</div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const RecapTitles = ({closing = false}: {closing?: boolean}) => {
  const frame = useCurrentFrame();
  const duration = closing ? 132 : 192;
  const opacity = sceneOpacity(frame, duration, 13, closing ? 16 : 13);

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          width: 1920,
          height: 1080,
          transform: "scale(2)",
          transformOrigin: "top left",
          color: COLORS.white,
          fontFamily: TYPE.sans,
          background: closing ? COLORS.black : "transparent",
        }}
      >
        {!closing && (
          <div
            style={{
              position: "absolute",
              inset: "650px 0 0",
              opacity,
              background:
                "linear-gradient(180deg, rgba(10,10,10,0), rgba(10,10,10,0.65))",
            }}
          />
        )}
        <div
          style={{
            position: "absolute",
            left: 696,
            width: 528,
            top: closing ? 300 : 800,
            textAlign: "center",
            opacity,
          }}
        >
          <TypeReveal delay={4} duration={13} distance={18}>
            <Img
              src={logo}
              style={{
                width: closing ? 150 : 116,
                height: closing ? 40 : 31,
                objectFit: "contain",
                filter: "invert(1)",
                marginBottom: closing ? 48 : 18,
              }}
            />
          </TypeReveal>
          <TypeReveal delay={9} duration={19} distance={24}>
            <div
              style={{
                fontSize: closing ? 132 : 104,
                fontWeight: 520,
                lineHeight: 0.95,
                letterSpacing: "-0.075em",
                paddingRight: 8,
              }}
            >
              1620
            </div>
          </TypeReveal>
          <TypeReveal delay={18} duration={13} distance={14}>
            <div
              style={{
                marginTop: closing ? 35 : 23,
                fontFamily: TYPE.mono,
                fontSize: 14,
                fontWeight: 500,
                letterSpacing: "0.08em",
                lineHeight: 1.5,
              }}
            >
              {closing ? "18 ARTISTS · 16 × 20 IN." : "NYC CULTURE CLUB"}
            </div>
          </TypeReveal>
          {closing && (
            <TypeReveal delay={28} duration={13} distance={14}>
              <div
                style={{
                  marginTop: 55,
                  fontSize: 19,
                  lineHeight: 1.3,
                  letterSpacing: "-0.025em",
                }}
              >
                mcliv.studio/1620
              </div>
            </TypeReveal>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};
