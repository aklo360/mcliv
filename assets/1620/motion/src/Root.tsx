import {Composition} from "remotion";
import {FlyerMotion} from "./FlyerMotion";
import {TOTAL_FRAMES} from "./timing";

export const RemotionRoot = () => (
  <Composition
    id="FlyerMotionV014"
    component={FlyerMotion}
    durationInFrames={TOTAL_FRAMES}
    fps={30}
    width={1080}
    height={1920}
  />
);
