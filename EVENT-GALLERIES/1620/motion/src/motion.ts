import {Easing, interpolate} from "remotion";

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

export const easeOut = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });

export const easeInOut = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

export const sceneOpacity = (
  frame: number,
  duration: number,
  fadeIn = 10,
  fadeOut = 10,
) => {
  if (frame < fadeIn) return easeOut(frame, 0, fadeIn);
  if (frame > duration - fadeOut) {
    return 1 - easeInOut(frame, duration - fadeOut, duration);
  }
  return 1;
};

export const revealY = (frame: number, start: number, distance = 34) => {
  const progress = easeOut(frame, start, start + 16);
  return {
    opacity: progress,
    transform: `translateY(${(1 - progress) * distance}px)`,
  };
};
