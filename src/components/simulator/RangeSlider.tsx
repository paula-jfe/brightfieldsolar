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
  return (
    <div className="w-full">
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={label} className="text-text-on-light-muted">
          {label}
        </label>
        <span className="whitespace-nowrap text-3xl font-extrabold">{valueLabel}</span>
      </div>
      <input
        id={label}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-3 w-full accent-mirage-950"
      />
      <div className="mt-1 flex justify-between text-sm text-text-on-light-muted">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  );
}
