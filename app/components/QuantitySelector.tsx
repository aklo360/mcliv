"use client";

import {useState} from 'react';

type Props = {
  min?: number;
  max?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
};

export function QuantitySelector({
  min = 1,
  max = 10,
  defaultValue = 1,
  onChange,
}: Props) {
  const [value, setValue] = useState(defaultValue);

  const update = (next: number) => {
    const clamped = Math.min(Math.max(next, min), max);
    setValue(clamped);
    onChange?.(clamped);
  };

  return (
    <div className="qty">
      <button type="button" onClick={() => update(value - 1)} aria-label="Decrease quantity">
        −
      </button>
      <span aria-live="polite">{value}</span>
      <button type="button" onClick={() => update(value + 1)} aria-label="Increase quantity">
        +
      </button>
      <input type="hidden" name="quantity" value={value} />
    </div>
  );
}
