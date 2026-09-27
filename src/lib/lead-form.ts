// Validation rules and input helpers for the lead form.
export type LeadValues = { name: string; email: string; phone: string; consent: boolean };
export type LeadField = keyof LeadValues;
export type LeadErrors = Partial<Record<LeadField, string>>;

export const NAME_MAX = 60;
export const EMAIL_MAX = 254;

const NAME_ALLOWED = /^[\p{L}\p{M}' .-]+$/u;
const EMAIL_LOCAL = /^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*$/;
const DOMAIN_LABEL = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?$/;
const PHONE_ALLOWED = /^[\d\s().+-]+$/;

export function validateName(raw: string): string | undefined {
  const name = raw.trim().replace(/\s+/g, " ");
  if (!name) return "Enter your name.";
  if (!NAME_ALLOWED.test(name)) return "Use letters only. Spaces, hyphens and apostrophes are fine.";
  if ((name.match(/\p{L}/gu) ?? []).length < 2) return "Enter your full name.";
  if (name.length > NAME_MAX) return `Keep your name under ${NAME_MAX} characters.`;
  return undefined;
}

export function validateEmail(raw: string): string | undefined {
  const email = raw.trim();
  const generic = "Enter a valid email address, like name@example.com.";
  if (!email) return "Enter your email address.";
  if (email.length > EMAIL_MAX) return generic;
  const at = email.lastIndexOf("@");
  if (at < 1 || email.indexOf("@") !== at) return generic;
  const local = email.slice(0, at);
  const domain = email.slice(at + 1);
  if (local.length > 64 || !EMAIL_LOCAL.test(local)) return generic;
  const labels = domain.split(".");
  if (labels.length < 2 || !labels.every((label) => DOMAIN_LABEL.test(label))) return generic;
  if (!/^[A-Za-z]{2,}$/.test(labels[labels.length - 1])) return generic;
  return undefined;
}

export function validatePhone(raw: string): string | undefined {
  const phone = raw.trim();
  const generic = "Enter a valid 10-digit US phone number.";
  if (!phone) return "Enter your phone number.";
  if (!PHONE_ALLOWED.test(phone)) return generic;
  let digits = phone.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) digits = digits.slice(1);
  if (digits.length !== 10) return generic;
  if (!/^[2-9]\d{2}[2-9]\d{6}$/.test(digits)) return generic;
  if (/^(\d)\1{9}$/.test(digits)) return generic;
  return undefined;
}

export function validateLead(values: LeadValues): LeadErrors {
  const errors: LeadErrors = {};
  const name = validateName(values.name);
  const email = validateEmail(values.email);
  const phone = validatePhone(values.phone);
  if (name) errors.name = name;
  if (email) errors.email = email;
  if (phone) errors.phone = phone;
  if (!values.consent) errors.consent = "Please agree to be contacted so we can follow up.";
  return errors;
}

export function formatPhone(raw: string): string {
  let digits = raw.replace(/\D/g, "");
  const country = digits.length > 10 && digits.startsWith("1") ? "1 " : "";
  if (country) digits = digits.slice(1);
  digits = digits.slice(0, 10);
  if (digits.length === 0) return country.trim();
  if (digits.length < 4) return `${country}(${digits}`;
  if (digits.length < 7) return `${country}(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `${country}(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

const COMMON_DOMAINS = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "icloud.com", "aol.com", "comcast.net", "msn.com", "live.com"];

function editDistance(a: string, b: string): number {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return dp[a.length][b.length];
}

export function suggestEmail(raw: string): string | null {
  const email = raw.trim().toLowerCase();
  const at = email.lastIndexOf("@");
  if (at < 1) return null;
  const domain = email.slice(at + 1);
  if (!domain || COMMON_DOMAINS.includes(domain)) return null;
  let best: string | null = null;
  let bestDistance = Infinity;
  for (const candidate of COMMON_DOMAINS) {
    const distance = editDistance(domain, candidate);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = candidate;
    }
  }
  return best && bestDistance > 0 && bestDistance <= 2 ? `${email.slice(0, at)}@${best}` : null;
}
