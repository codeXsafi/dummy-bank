/*
 * lib/maskEmail.ts — masks an email's local-part for display on the MFA
 * step ("We sent a 6-digit code to m***r@dummybank.com").
 */

export function maskEmail(email: string): string {
  const [localPart, domain] = email.split("@");
  if (!localPart || !domain) return email;

  if (localPart.length <= 2) {
    return email;
  }

  const first = localPart[0];
  const last = localPart[localPart.length - 1];
  const maskedMiddle = "*".repeat(localPart.length - 2);
  return `${first}${maskedMiddle}${last}@${domain}`;
}
