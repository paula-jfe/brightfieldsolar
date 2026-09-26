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
    <div>
      <p className="text-sm font-semibold">Which home is closest to yours?</p>
      <div className="mt-3 grid grid-cols-2 gap-3">
        {profiles.map((profile, index) => {
          const active = index === selectedIndex;
          return (
            <button
              key={profile.label}
              type="button"
              onClick={() => onSelect(index)}
              aria-pressed={active}
              className={`rounded-xl border p-3 text-left text-xs transition-colors ${
                active
                  ? "border-accent-sky bg-bg-accent-soft ring-2 ring-accent-sky"
                  : "border-border-light bg-bg-card hover:border-accent-sky"
              }`}
            >
              <span className="block font-semibold text-text-on-light">{profile.label}</span>
              <span className="mt-1 block text-text-on-light-muted">~{formatCurrency(profile.typicalBill)}/mo</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
