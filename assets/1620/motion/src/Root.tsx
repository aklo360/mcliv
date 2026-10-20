import {Composition} from "remotion";
import {FlyerMotion} from "./FlyerMotion";
import {TOTAL_FRAMES} from "./timing";
import {RecapTitles, RecapWhiteOpening} from "./RecapTitles";
import {RecapCards4x3} from "./RecapCards4x3";

export const RemotionRoot = () => (
  <>
    <Composition id="RecapOpening4x3V003" component={RecapCards4x3}
      durationInFrames={89} fps={24} width={2880} height={2160} />
    <Composition id="RecapClosing4x3V003" component={RecapCards4x3}
      defaultProps={{closing: true}} durationInFrames={96} fps={24} width={2880} height={2160} />
    <Composition id="RecapOpening4x3V002" component={RecapWhiteOpening}
      defaultProps={{standalone: true}} durationInFrames={89} fps={24} width={2880} height={2160} />
    <Composition id="RecapClosing4x3V002" component={RecapWhiteOpening}
      defaultProps={{standalone: true, closing: true}} durationInFrames={96} fps={24} width={2880} height={2160} />
    <Composition id="RecapOpening4x3V001" component={RecapWhiteOpening}
      defaultProps={{standalone: true}} durationInFrames={89} fps={24} width={2880} height={2160} />
    <Composition id="RecapClosing4x3V001" component={RecapWhiteOpening}
      defaultProps={{standalone: true, closing: true}} durationInFrames={96} fps={24} width={2880} height={2160} />
    <Composition id="RecapClosing16x9V013" component={RecapWhiteOpening}
      defaultProps={{standalone: true, closing: true}} durationInFrames={96} fps={24} width={3840} height={2160} />
    <Composition id="RecapClosing9x16V013" component={RecapWhiteOpening}
      defaultProps={{standalone: true, closing: true}} durationInFrames={96} fps={24} width={1080} height={1920} />
    <Composition id="RecapWhiteOpening16x9V003" component={RecapWhiteOpening}
      defaultProps={{standalone: true}} durationInFrames={89} fps={24} width={3840} height={2160} />
    <Composition id="RecapWhiteOpening9x16V003" component={RecapWhiteOpening}
      defaultProps={{standalone: true}} durationInFrames={89} fps={24} width={1080} height={1920} />
    <Composition id="RecapWhiteOpening16x9V002" component={RecapWhiteOpening}
      durationInFrames={125} fps={24} width={3840} height={2160} />
    <Composition id="RecapWhiteOpening9x16V002" component={RecapWhiteOpening}
      durationInFrames={125} fps={24} width={1080} height={1920} />
    <Composition
      id="FlyerMotionV014"
      component={FlyerMotion}
      durationInFrames={TOTAL_FRAMES}
      fps={30}
      width={1080}
      height={1920}
    />
    <Composition
      id="RecapOpeningV001"
      component={RecapTitles}
      durationInFrames={192}
      fps={24}
      width={3840}
      height={2160}
    />
    <Composition
      id="RecapClosingV001"
      component={RecapTitles}
      defaultProps={{closing: true}}
      durationInFrames={132}
      fps={24}
      width={3840}
      height={2160}
    />
  </>
);
