export const COLORS = {
  black: "#000000",
  white: "#FFFFFF",
  line: "rgba(255, 255, 255, 0.24)",
  lineQuiet: "rgba(255, 255, 255, 0.12)",
  muted: "rgba(255, 255, 255, 0.62)",
  quiet: "rgba(255, 255, 255, 0.38)",
} as const;

export const TYPE = {
  sans: '"Helvetica Neue", Helvetica, Arial, sans-serif',
  mono: '"JetBrains Mono", "JetBrainsMono Nerd Font", Menlo, monospace',
} as const;

export const GRID = {
  width: 1080,
  height: 1920,
  marginX: 64,
  safeTop: 240,
  safeBottom: 1680,
  headerTop: 278,
  headerHeight: 82,
  contentTop: 410,
  contentBottom: 1592,
} as const;
