import {AbsoluteFill, Sequence} from "remotion";
import {ArchiveHeader, FrameArchitecture} from "./components/FrameArchitecture";
import {AfterParty} from "./scenes/AfterParty";
import {Artists} from "./scenes/Artists";
import {Identity} from "./scenes/Identity";
import {InstallationWave} from "./scenes/InstallationWave";
import {Opening} from "./scenes/Opening";
import {Premise} from "./scenes/Premise";
import {COLORS, TYPE} from "./tokens";
import {TIMING} from "./timing";

export const FlyerMotion = () => (
  <AbsoluteFill
    style={{
      backgroundColor: COLORS.black,
      color: COLORS.white,
      fontFamily: TYPE.sans,
      WebkitFontSmoothing: "antialiased",
      textRendering: "optimizeLegibility",
      overflow: "hidden",
    }}
  >
    <FrameArchitecture />

    <Sequence from={TIMING.identity.from} durationInFrames={TIMING.identity.duration} premountFor={30}>
      <Identity duration={TIMING.identity.duration} />
    </Sequence>
    <Sequence from={TIMING.premise.from} durationInFrames={TIMING.premise.duration} premountFor={30}>
      <Premise duration={TIMING.premise.duration} />
    </Sequence>
    <Sequence from={TIMING.wave.from} durationInFrames={TIMING.wave.duration} premountFor={30}>
      <InstallationWave duration={TIMING.wave.duration} />
    </Sequence>
    <Sequence from={TIMING.artists.from} durationInFrames={TIMING.artists.duration} premountFor={30}>
      <Artists duration={TIMING.artists.duration} />
    </Sequence>
    <Sequence from={TIMING.opening.from} durationInFrames={TIMING.opening.duration} premountFor={30}>
      <Opening duration={TIMING.opening.duration} />
    </Sequence>
    <Sequence
      from={TIMING.afterParty.from}
      durationInFrames={TIMING.afterParty.duration}
      premountFor={30}
    >
      <AfterParty duration={TIMING.afterParty.duration} />
    </Sequence>
    <ArchiveHeader />
  </AbsoluteFill>
);
