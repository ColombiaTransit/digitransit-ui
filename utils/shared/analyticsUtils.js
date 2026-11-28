import Cookies from 'universal-cookie';
import { PREFIX_ITINERARY_SUMMARY, PREFIX_ROUTES } from './path.js';

/**
 * This file contains functions for UI analytics.
 * Contains code used in both client and server
 */

const COORDINATES = /-?\d{1,3}\.\d+\s*,\s*-?\d{1,3}\.\d+/;

/**
 * Path for analytics without personal data: no query string or hash, and
 * place segments (origin/destination "address::lat,lon", coordinates) are
 * replaced by "place".
 *
 * @param {string} path - pathname, optionally with query string or hash
 * @return {string}
 */
export function sanitizeAnalyticsPath(path = '/') {
  const pathname = String(path).split(/[?#]/)[0] || '/';
  return pathname
    .split('/')
    .map(segment => {
      let decoded = segment;
      try {
        decoded = decodeURIComponent(segment);
      } catch {
        // keep the raw segment
      }
      return decoded.includes('::') || COORDINATES.test(decoded)
        ? 'place'
        : segment;
    })
    .join('/');
}

/**
 * Forward an event to Matomo, when the Matomo tracker (_paq) or Tag Manager
 * (_mtm) was loaded by getAnalyticsInitCode. Only pageviews and
 * 'sendMatomoEvent' events are forwarded, with category, action and name only.
 *
 * @param {object} event
 */
function sendToMatomo(event) {
  const { _paq: paq, _mtm: mtm } = window;
  if (!paq && !mtm) {
    return;
  }
  if (event.event === 'Pageview') {
    const url = `${window.location.origin}${sanitizeAnalyticsPath(event.url)}`;
    if (paq) {
      paq.push(['setCustomUrl', url]);
      if (window.matomoTracking === 'tracker') {
        paq.push(['trackPageView']);
      }
    }
    if (mtm) {
      mtm.push({ event: 'Pageview', url });
    }
    return;
  }
  if (event.event !== 'sendMatomoEvent' || !event.category || !event.action) {
    return;
  }
  const name =
    event.name === undefined || event.name === null
      ? undefined
      : String(event.name);
  if (paq && window.matomoTracking === 'tracker') {
    paq.push(
      ['trackEvent', event.category, event.action, name].filter(
        v => v !== undefined,
      ),
    );
  }
  if (mtm) {
    mtm.push({
      event: 'sendMatomoEvent',
      category: event.category,
      action: event.action,
      name,
    });
  }
}

/**
 * Add an analytics event to be sent to analytics server
 * Currently events have fields { event, category, action, name }
 *
 * @param {object} event
 *
 * @return void
 */
export function addAnalyticsEvent(event) {
  let newEvent = event;
  if (event.event === undefined) {
    // this is the default event field if none is defined
    newEvent = { event: 'sendMatomoEvent', ...event };
  }
  if (window.dataLayer) {
    window.dataLayer.push(newEvent);
  }
  sendToMatomo(newEvent);
}

/**
 * Matomo script: the tracker (MATOMO_URL + MATOMO_SITE_ID) or a Tag Manager
 * container (MATOMO_URL is the container .js). Pageviews and events are sent
 * by addAnalyticsEvent, so the script itself tracks nothing.
 *
 * @param {object} config
 * @return {string} - script tag, or '' when Matomo is not configured
 */
export function getMatomoScript(config) {
  const { MATOMO_URL: url, MATOMO_SITE_ID: siteId } = config;
  if (!url) {
    return '';
  }
  const noCookies = config.matomoDisableCookies !== false;
  const json = value => JSON.stringify(value).replace(/</g, '\\u003c');
  if (siteId) {
    const base = url.endsWith('/') ? url : `${url}/`;
    return `<script>
window.matomoTracking='tracker';
var _paq=window._paq=window._paq||[];
${noCookies ? "_paq.push(['disableCookies']);\n" : ''}_paq.push(['enableLinkTracking']);
_paq.push(['setTrackerUrl',${json(`${base}matomo.php`)}]);
_paq.push(['setSiteId',${json(String(siteId))}]);
(function(){var d=document,g=d.createElement('script'),s=d.getElementsByTagName('script')[0];
g.async=true;g.src=${json(`${base}matomo.js`)};s.parentNode.insertBefore(g,s);})();
</script>\n`;
  }
  return `<script>
window.matomoTracking='tagmanager';
var _paq=window._paq=window._paq||[];
${noCookies ? "_paq.push(['disableCookies']);\n" : ''}var _mtm=window._mtm=window._mtm||[];
_mtm.push({'mtm.startTime':(new Date().getTime()),'event':'mtm.Start'});
(function(){var d=document,g=d.createElement('script'),s=d.getElementsByTagName('script')[0];
g.async=true;g.src=${json(url)};s.parentNode.insertBefore(g,s);})();
</script>\n`;
}

/**
 * Builds an inline CE2 survey script tag.
 *
 * @param {object} surveyIds - Map of language code → Crazy Egg survey UUID.
 *   Only languages explicitly listed will trigger a survey; no fallback is applied.
 *   e.g. `{ fi: 'uuid-fi', sv: 'uuid-sv', en: 'uuid-en' }`
 * @param {object} [options]
 * @param {string} [options.language] - Current user language (from the lang cookie). If the
 *   language is not a key in surveyIds, no script is generated.
 * @param {string} [options.pathPrefix] - Only show when pathname includes this value
 * @param {number} [options.surveyShare] - Modulo divisor for sampling (e.g. 250 → ~0.4% of visits)
 * @param {number} [options.delay] - Milliseconds to wait before showing the survey
 * @param {boolean} [options.mobileChecks] - Skip survey when mobile overlays are open
 * @return {string} - HTML script tag string, or '' if no survey ID matches the language
 */
export function buildCrazyEggSurveyScript(surveyIds, options = {}) {
  const { language, pathPrefix, surveyShare, delay, mobileChecks } = options;

  const surveyId = surveyIds[language];
  if (!surveyId) {
    return '';
  }

  const pathCheck = pathPrefix
    ? `window.location.pathname.includes("${pathPrefix}")`
    : null;
  const samplingCheck = surveyShare
    ? `(Math.floor(Date.now()/1000)%${surveyShare})===0`
    : null;
  const outerCondition = [pathCheck, samplingCheck].filter(Boolean).join('&&');

  const mobileGuard = mobileChecks
    ? `if(!document.getElementsByClassName('offcanvas-mobile')[0]&&!document.getElementById('digitransit-mobile-datetime')){CE2.showSurvey("${surveyId}")};`
    : `CE2.showSurvey("${surveyId}");`;

  let inner;
  if (delay) {
    inner = `setTimeout(()=>{${mobileGuard}},${delay});`;
  } else {
    inner = mobileGuard;
  }

  const body = outerCondition ? `if(${outerCondition}){${inner}}` : inner;

  return `<script type="text/javascript">(window.CE_API||(window.CE_API=[])).push(function(){${body}});</script>`;
}

/**
 * Get code to initialize UI analytics in server side: Matomo when
 * config.MATOMO_URL is set, otherwise config.analyticsScript or Google Tag
 * Manager (config.GTMid). Nothing is loaded without consent when
 * config.useCookiesPrompt is set.
 *
 * @param {object} config
 * @param {object} req - express request
 *
 * @return string
 */
export function getAnalyticsInitCode(config, req) {
  const { hostname } = req;
  const cookies = new Cookies(req.headers.cookie, { path: '/' });
  const cookieConsent = cookies.get('cookieConsent');

  let script = config.GTMid
    ? // Google Tag Manager script
      `<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${config.GTMid}');</script>\n`
    : '';

  const useAnalytics =
    !config.useCookiesPrompt ||
    cookieConsent === 'true' ||
    cookieConsent === true;

  if (useAnalytics) {
    // Matomo replaces Google Tag Manager when configured
    const matomo = getMatomoScript(config);
    if (matomo) {
      return matomo;
    }
    if (
      config.analyticsScript &&
      hostname &&
      (!hostname.match(/dev|test/) || config.devAnalytics)
    ) {
      return config.analyticsScript(
        hostname,
        config.sendAnalyticsCustomEventGoals,
      );
    }
    if (config.crazyEgg) {
      const surveyShare = config.SURVEY_SHARE || 250;
      const surveyStartupDelay = 8000;
      const lang = cookies.get('lang');
      const ceBase =
        '<script type="text/javascript" src="//script.crazyegg.com/pages/scripts/0030/3436.js" async="async" ></script>';
      // Show survey conditions for certain share of page loads:
      // - only in itinerary page
      // - after 8 s delay
      // - not when mobile time picker or mobile settings are open
      const ceItineraryPage = buildCrazyEggSurveyScript(
        {
          fi: '8cb293bb-6785-481a-81c3-7f4e6f04a536',
          sv: '904fe02f-fde8-41b7-933b-ea215cdd5a00',
          en: '254eb853-fa71-4b3c-8313-9eeca10129b6',
        },
        {
          language: lang,
          pathPrefix: PREFIX_ITINERARY_SUMMARY,
          surveyShare,
          delay: surveyStartupDelay,
          mobileChecks: true,
        },
      );
      // Show survey conditions for certain share of page loads:
      // - only in route page
      // - after 8 s delay
      // - not when mobile time picker or mobile settings are open
      const ceRoutePage = buildCrazyEggSurveyScript(
        { fi: '96b0b2f3-bc5a-4b40-b910-cc65bb5b6cd9' },
        {
          language: lang,
          pathPrefix: PREFIX_ROUTES,
          surveyShare,
          delay: surveyStartupDelay,
          mobileChecks: true,
        },
      );
      script = `${script}${ceBase}${ceItineraryPage}${ceRoutePage}`;
    }
  }
  return script;
}

const handleChange = () => {
  if (!window.CookieInformation) {
    return false;
  }
  const allow = window.CookieInformation.getConsentGivenFor(
    'cookie_cat_statistic',
  );
  if (allow === undefined) {
    // happens in incognito
    return false;
  }
  const cookies = new Cookies();
  const cookieConsent = cookies.get('cookieConsent');
  const oldState = cookieConsent === true || cookieConsent === 'true';

  cookies.set('cookieConsent', allow, {
    maxAge: 100 * 365 * 24 * 60 * 60,
    path: '/',
    Secure: true,
    SameSite: 'Strict',
  });

  if (oldState !== allow) {
    // consent changed, reload page
    window.location.reload();
  }
  return allow;
};

/**
 * Client side intialization for UI analytics
 *
 * @return void
 */
export function initAnalyticsClientSide(config, cookies = new Cookies()) {
  const useAnalytics =
    !config.useCookiesPrompt || cookies.get('cookieConsent') === true;

  if (useAnalytics) {
    window.dataLayer = window.dataLayer || [];
  }
  if (config.useCookiesPrompt) {
    window.addEventListener(
      'CookieInformationConsentGiven',
      handleChange,
      false,
    );
  }
}

/**
 * Handle user analytics
 * @param {object} user - user object
 * @param {object} config - configuration object
 */
export function handleUserAnalytics(config) {
  if (config.loginAnalyticsEventName && config.user.sub) {
    addAnalyticsEvent({
      event: config.loginAnalyticsEventName,
      [config.loginAnalyticsKey]: config.user.sub,
    });
  }
}
