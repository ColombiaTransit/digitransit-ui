# ColombiaTransit Digitransit UI — Worklist

This file tracks ColombiaTransit-specific follow-up work for the Digitransit UI fork.

## About page — project information and dynamic data status

**Status:** Planned  
**Priority:** Backlog  
**Relevant code:** `app/component/AboutPage.jsx`, `server/configs/config.default.js` (`aboutThisService`)

### Requirements

- [ ] Provide localized ColombiaTransit About content (Spanish first, plus other supported languages): project description, contact and disclaimers.
- [ ] Show credits, licences and links to Digitransit, OpenTripPlanner, OpenStreetMap, GTFS datasets and their original authorities/operators.
- [ ] Extend the About React component with a section called **Estado de los datos**.
- [ ] Read current published GTFS metadata from a central, machine-readable endpoint or generated release artifact; avoid manually maintained counters.
- [ ] Show, where supported by data: number of cities, routes, stops, operators/feeds and last data update.
- [ ] Surface provenance and limitations for relevant datasets (official/reconstructed, data quality, real-time availability) and link to source records.
- [ ] Gracefully handle missing or unreachable metadata: keep the static About content functional; show no invented values.
- [ ] Treat third-party text as untrusted; avoid inserting raw API/CMS HTML with `dangerouslySetInnerHTML`.
- [ ] Ensure mobile/accessibility support and add tests for localization, dynamic data and failure states.

### Implementation notes

The existing About page is driven by `config.aboutThisService[config.language]`. Static sections can remain configuration-driven; build dynamic reporting as a separate React component. The GTFS publishing workflows should generate the summary JSON so changes become visible without rebuilding the UI. A full CMS is not required for the first version.

**Not in scope yet:** implementation, deployment, or a complete CMS.

## Analytics — optional Matomo Tag Manager integration

**Status:** Planned  
**Priority:** Backlog  
**Reference implementation:** [stadtnavi/digitransit-ui](https://github.com/stadtnavi/digitransit-ui) (`app/util/analyticsUtils.js`)  
**Relevant code:** `utils/shared/analyticsUtils.js`, `server/configs/config.default.js`, `server/middleware/shell.js`, existing analytics events and tests.

### Requirements

- [ ] Add Matomo / Matomo Tag Manager as a configurable alternative to Google Tag Manager, preserving existing GTM support for other deployments.
- [ ] Configure via environment/config values (Matomo Tag Manager container URL, or Matomo tracker URL and site ID for direct tracking).
- [ ] Reuse the existing `window.dataLayer` event model wherever possible; explicitly bridge/map events into Matomo Tag Manager (which uses `_mtm`) rather than assuming that emitting `sendMatomoEvent` automatically records anything.
- [ ] Define tags/triggers for existing Digitransit events: route/stop views, itinerary interactions, transport-mode preferences, favourites, rental/taxi link clicks, and other useful non-personal usage events.
- [ ] Track the first page load and subsequent single-page-app navigations as pageviews, without duplicate pageview counting.
- [ ] Respect the existing cookie-consent mechanism; do not load analytics or send events before required consent. Test consent changes and withdrawals.
- [ ] Prevent collection of sensitive data: strip/redact precise origin/destination coordinates and query strings from tracked URLs, and exclude account/user identifiers (including HSL-specific login analytics fields).
- [ ] Document deployment variables, consent behaviour, events, Matomo container setup, and an example privacy-friendly dashboard.
- [ ] Add/update unit and integration tests for Matomo-only, GTM-only, disabled analytics, consent and SPA navigation.

### Implementation notes

The HSL UI already emits many custom analytics events via `addAnalyticsEvent` and `window.dataLayer`, often with `event: 'sendMatomoEvent'`. The Stadtnavi fork contains a Matomo bootstrap example, but its older implementation should **not** be copied wholesale. Preserve the current HSL consent logic and adapt the integration to the current codebase.

**Not in scope yet:** implementation, deployment or configuration of a live Matomo server.
