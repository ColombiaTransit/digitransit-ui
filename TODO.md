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
