import type {ReactNode} from 'react';

/** Renders a string with every "MCLIV" styled as the brand mark (italic + strikethrough). */
export function brandText(text: string): ReactNode {
  const parts = text.split(/(MCLIV)/g);
  if (parts.length === 1) return text;
  return parts.map((part, i) =>
    part === 'MCLIV' ? (
      // eslint-disable-next-line react/no-array-index-key
      <span key={i} className="brand-mark">
        MCLIV
      </span>
    ) : (
      part
    ),
  );
}
