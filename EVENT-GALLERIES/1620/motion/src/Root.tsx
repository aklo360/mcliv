import {Composition} from "remotion";
import {FlyerMotion} from "./FlyerMotion";

export const RemotionRoot = () => (
  <Composition
    id="FlyerMotionV001"
    component={FlyerMotion}
    durationInFrames={540}
    fps={30}
    width={1080}
    height={1920}
  />
);
