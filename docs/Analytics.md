# Analytics

The UI sends usage events with `addAnalyticsEvent` (`utils/shared/analyticsUtils.js`):
pageviews (`event: 'Pageview'`, from `app/client/client.jsx` and `TopLevel.jsx`) and
interaction events (`event: 'sendMatomoEvent'` with `category`, `action`, `name`). The
script that receives them is added to the HTML shell by `getAnalyticsInitCode`, in this
order of precedence:

1. **Matomo**, when `MATOMO_URL` is set (replaces Google Tag Manager).
2. `config.analyticsScript` (e.g. Plausible or a Matomo container in `config.waltti.js`, `config.matka.js`).
3. **Google Tag Manager**, when `GTM_ID` is set (`config.GTMid`); events go to `window.dataLayer`.

With `config.useCookiesPrompt` nothing is loaded before consent (`cookieConsent` cookie).

## Matomo

| Variable | Meaning |
| --- | --- |
| `MATOMO_URL` | Matomo base URL (e.g. `https://stats.example.org/`), or the URL of a Tag Manager container `.js` when `MATOMO_SITE_ID` is not set |
| `MATOMO_SITE_ID` | Site id: track directly with the Matomo tracker |
| `MATOMO_DISABLE_COOKIES` | `false` lets Matomo set cookies; default is cookieless tracking |

The values can also be set in a deployment config (`MATOMO_URL`, `MATOMO_SITE_ID`,
`matomoDisableCookies`).

**Tracker** (`MATOMO_URL` + `MATOMO_SITE_ID`): every `Pageview` becomes
`setCustomUrl` + `trackPageView`, every `sendMatomoEvent` becomes
`trackEvent(category, action, name)`. The script itself tracks no pageview, so the first
page load is counted once (by the client's initial `Pageview`).

**Tag Manager** (`MATOMO_URL` only): the same events are pushed to `window._mtm` as
`{ event: 'Pageview', url }` and `{ event: 'sendMatomoEvent', category, action, name }`.
In the container, add Custom Event triggers for `Pageview` and `sendMatomoEvent`, data
layer variables `url`, `category`, `action` and `name`, a Matomo pageview tag with custom
URL `{{url}}` on `Pageview`, and a Matomo event tag on `sendMatomoEvent`. Do not also fire
a pageview on "Pageview" (page load) or "History Change", or pageviews are counted twice.

### Privacy

- URLs are sanitized (`sanitizeAnalyticsPath`): no query string or hash, and path segments
  with a place (`address::lat,lon`) or coordinates become `place`. Route and stop ids stay.
- Only `category`, `action` and `name` of an event are forwarded; other fields (such as
  the address in some events) and other events (such as login analytics) are not.
- Cookieless by default; `enableLinkTracking` reports outgoing links and downloads.
