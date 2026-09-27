// Labeled range slider used for the bill and coverage inputs.
import { useId, type CSSProperties } from "react";

export function RangeSlider({
  label,
  valueLabel,
  minLabel,
  maxLabel,
  min,
  max,
  step,
  value,
  onChange,
}: {
  label: string;
  valueLabel: string;
  minLabel: string;
  maxLabel: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
}) {
  const id = useId();
  const fill = ((value - min) / (max - min)) * 100;

  return (
    <div className="w-full">
      <div className="flex items-start justify-between gap-4">
        <label htmlFor={id} className="text-lg font-semibold leading-[1.4] text-text-on-light">
          {label}
        </label>
        <span
          aria-hidden="true"
          className="font-display whitespace-nowrap text-[22px] font-bold leading-[1.3] text-accent-warm"
        >
          {valueLabel}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={valueLabel}
        onChange={(event) => onChange(Number(event.target.value))}
        className="range mt-1"
        style={{ "--fill": `${fill}%` } as CSSProperties}
      />
      <div className="flex justify-between text-sm leading-5 text-text-on-light-muted">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  );
}
