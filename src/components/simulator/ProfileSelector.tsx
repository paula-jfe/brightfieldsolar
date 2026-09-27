import type { HouseholdProfile } from "@/data/types";
import { formatCurrency } from "@/lib/format";
import { ProfileIcon } from "./ProfileIcon";

/**
 * Figma "Profile Option" cards. Selecting one is a shortcut: it fills in the
 * profile's typical bill (see Simulator). Desktop shows the full label from
 * the data file plus an illustrative icon; mobile shows `shortLabel` (when
 * the data provides one) and no icon, because the full labels wrap to three
 * lines in a half-width card at 390px. The icon is also hidden from 1024 to
 * 1279px, where the two-column simulator leaves each card only ~200px wide.
 *
 * No aria-label: the button's accessible name is its visible text (label +
 * typical bill), so voice-control users can say what they see (WCAG 2.5.3).
 */
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
    <div className="grid grid-cols-2 gap-2.5 md:gap-x-2.5 md:gap-y-4">
      {profiles.map((profile, index) => {
        const active = index === selectedIndex;
        return (
          <button
            key={profile.label}
            type="button"
            onClick={() => onSelect(index)}
            aria-pressed={active}
            className={`flex items-center gap-4 rounded-[var(--radius-inner)] p-3 text-left transition-[background-color,box-shadow,color] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-sky ${
              active
                ? "bg-bg-accent-soft ring-2 ring-inset ring-accent-sky"
                : "bg-bg-card ring-1 ring-inset ring-border-light hover:ring-accent-sky"
            }`}
          >
            {profile.icon && (
              <span
                aria-hidden="true"
                className={`hidden h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors md:flex lg:hidden xl:flex ${
                  active ? "bg-bg-dark text-text-on-dark" : "bg-bg-light-muted text-text-on-light-muted"
                }`}
              >
                <ProfileIcon name={profile.icon} />
              </span>
            )}
            <span className="flex min-w-0 flex-col gap-1">
              <span className="text-sm font-semibold leading-5 text-text-on-light">
                <span className="md:hidden">{profile.shortLabel ?? profile.label}</span>
                <span className="hidden md:inline">{profile.label}</span>
              </span>
              <span className="text-[13px] leading-[18px] text-text-on-light-muted">
                Typical {formatCurrency(profile.typicalBill)}/mo
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
