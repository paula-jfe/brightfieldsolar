import type { HouseholdProfile } from "@/data/types";
import { formatCurrency } from "@/lib/format";

export function ProfileSelector({
  profiles,
  selectedIndex,
  onSelect,
}: {
  profiles: HouseholdProfile[];
  selectedIndex: number | null;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3.5">
      {profiles.map((profile, index) => {
        const active = index === selectedIndex;
        return (
          <button
            key={profile.label}
            type="button"
            onClick={() => onSelect(index)}
            aria-pressed={active}
            className={`flex items-center gap-3.5 rounded-2xl border p-4 text-left text-sm transition-colors ${
              active
                ? "border-2 border-bg-dark bg-bg-accent-soft"
                : "border-border-light bg-bg-light-muted hover:border-accent-sky"
            }`}
          >
            <span
              aria-hidden="true"
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                active ? "bg-bg-dark" : "bg-bg-light-muted"
              }`}
            />
            <span className="flex flex-col gap-0.5">
              <span className={`font-bold ${active ? "text-text-accent-on-light" : "text-text-on-light"}`}>
                {profile.label}
              </span>
              <span className="text-text-on-light-muted">Typical bill: {formatCurrency(profile.typicalBill)}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
