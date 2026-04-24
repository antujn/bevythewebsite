/**
 * Apple App Site Association (AASA).
 *
 * Served at `/.well-known/apple-app-site-association` so that Apple's
 * CDN-scanning bots pick up Bevy as the iOS app to open when any
 * https://bevythewebsite.com/* URL is tapped in Messages, Mail, or
 * Safari on a device that already has Bevy installed — instead of
 * launching Safari. Classic "Universal Links" setup.
 *
 * Apple requires:
 *   - path: exactly /.well-known/apple-app-site-association (no .json)
 *   - Content-Type: application/json
 *   - 200 OK (no redirect, no authentication)
 *   - Stable across requests (no rate limiting)
 *
 * `Response.json` sets the Content-Type automatically; the
 * `force-static` export below caches the response at build time so
 * every request hits a CDN edge with no compute cost.
 *
 * App-side prerequisite (handled in bevytheapp):
 * `com.apple.developer.associated-domains` entitlement must list
 * `applinks:<domain>` for the domain serving this file. Without that
 * entitlement iOS will discover the AASA but refuse to open the app.
 */

import { APP_STORE_ID } from "@/lib/appStore";

// Apple team id from bevytheapp (DEVELOPMENT_TEAM in project.pbxproj)
// and the main app's bundle identifier. Widget extension gets the
// same app-team prefix but a different bundle id; universal links
// always target the host app, not the widget.
const APPLE_TEAM_ID = "G5B6B4Y2T5";
const APP_BUNDLE_ID = "bevy.bevy";
const APP_ID = `${APPLE_TEAM_ID}.${APP_BUNDLE_ID}`;

export const dynamic = "force-static";

export function GET() {
  return Response.json({
    applinks: {
      // Empty `apps` is required by the legacy AASA schema even with
      // the modern `details` block below. Keeping it preserves
      // compatibility for iOS versions that still prefer the old
      // shape.
      apps: [],
      details: [
        {
          appIDs: [APP_ID],
          // Every path on this domain opens the app. Tighten later
          // (e.g. match "/bundles/*") if specific routes should fall
          // through to the website instead.
          components: [{ "/": "*" }],
          // Legacy `paths` key for iOS 12 and earlier — new clients
          // use `components` above.
          paths: ["*"],
        },
      ],
    },
    // Advertise the app's App Store listing — a belt-and-suspenders
    // hint for crawlers that read AASA to understand "which store
    // product is behind this domain."
    appstoreID: APP_STORE_ID,
  });
}
