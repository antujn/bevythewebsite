/**
 * RFC 9116 security.txt — advertises where to report vulnerabilities.
 *
 * Served at `/.well-known/security.txt` so researchers + automated
 * scanners can find a disclosure contact without having to dig
 * through the site for an email.
 *
 * Format is a plain-text key/value list, one directive per line. Each
 * `Expires` interval is typically one year; bump this file when it
 * approaches the expiry date.
 */

export const dynamic = "force-static";

export function GET() {
  const body = [
    "Contact: mailto:bevytheapp@gmail.com",
    "Expires: 2027-04-24T00:00:00Z",
    "Preferred-Languages: en",
    "Canonical: https://bevythewebsite.com/.well-known/security.txt",
    "",
  ].join("\n");

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
