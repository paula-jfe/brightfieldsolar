// Icons for the household profile cards.
export const PROFILE_ICON_NAMES = ["apartment", "house", "houseAC", "pool"] as const;

export function ProfileIcon({ name }: { name?: string }) {
  switch (name) {
    case "apartment":
      return (
        <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" aria-hidden="true">
          <rect x="3.75" y="2.75" width="12.5" height="15.5" rx="1" stroke="currentColor" strokeWidth="1.5" />
          <g fill="currentColor">
            <rect x="6" y="5" width="3" height="3" />
            <rect x="11" y="5" width="3" height="3" />
            <rect x="6" y="9.3" width="3" height="3" />
            <rect x="11" y="9.3" width="3" height="3" />
            <rect x="6" y="13.6" width="3" height="3" />
            <rect x="11" y="13.6" width="3" height="3" />
          </g>
        </svg>
      );
    case "house":
      return (
        <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <path d="M2 9L10 2L18 9" />
          <rect x="4.8" y="9.8" width="10.4" height="7.4" />
        </svg>
      );
    case "houseAC":
      return (
        <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" aria-hidden="true">
          <g stroke="currentColor" strokeWidth="1.5">
            <path d="M1 8L8 2L15 8" />
            <rect x="3.75" y="8.75" width="8.5" height="6.5" />
          </g>
          <rect x="12" y="12" width="6" height="4" rx="1" fill="currentColor" />
        </svg>
      );
    case "pool":
      return (
        <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
          <path d="M1 6L7 1L13 6" />
          <rect x="3.2" y="6.7" width="7.6" height="4.6" />
          <path d="M1 15C3 13.667 5 13.667 7 15C9 16.333 11 16.333 13 15C15 13.667 17 13.667 19 15" />
          <path d="M1 18C3 17 5 17 7 18C9 19 11 19 13 18C15 17 17 17 19 18" />
        </svg>
      );
    default:
      return null;
  }
}
