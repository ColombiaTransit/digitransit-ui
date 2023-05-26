import configMerger from '../util/configMerger';

const matkaConfig = require('./config.matka').default;

const CONFIG = 'kela';
const APP_TITLE = 'Reittiopas';
const APP_DESCRIPTION = 'Digitransit-reittiopas';
const API_URL = process.env.API_URL || 'https://dev-api.digitransit.fi';
const OTP_URL = process.env.OTP_URL || `${API_URL}/routing/v2/routers/kela/`;
const MAP_URL =
  process.env.MAP_URL || 'https://digitransit-dev-cdn-origin.azureedge.net';
const POI_MAP_PREFIX = `${MAP_URL}/map/v3/kela`;

export default configMerger(matkaConfig, {
  CONFIG,
  title: APP_TITLE,

  URL: {
    OTP: OTP_URL,

    // read stops and stations OTP2 vector map tile server
    STOP_MAP: {
      default: `${POI_MAP_PREFIX}/fi/stops,stations/`,
      sv: `${POI_MAP_PREFIX}/sv/stops,stations/`,
    },
  },

  favicon: './app/configurations/images/default/favicon.png',
  feedIds: ['kela'],
  textLogo: true,
  logo: '', // override default logo from matka config
  appBarLink: false, // override default config - would show Traficom otherwise

  meta: {
    description: APP_DESCRIPTION,
  },

  socialMedia: {
    title: APP_TITLE,
    description: APP_DESCRIPTION,
    locale: 'fi_FI',
  },

  menu: {
    copyright: null,
    content: [
      {
        name: 'accessibility-statement',
        href: {
          fi: 'https://www.digitransit.fi/accessibility',
          sv: 'https://www.digitransit.fi/accessibility',
          en: 'https://www.digitransit.fi/en/accessibility',
        },
      },
      {
        name: 'about-these-pages',
        href: '/tietoja-palvelusta',
      },
    ],
  },

  transportModes: {
    citybike: {
      availableForSelection: false,
      default: false,
    },
    airplane: {
      availableForSelection: false,
      default: false,
    },
    walk: {
      availableForSelection: false,
      default: false,
    },
    car: {
      availableForSelection: true,
      default: false,
    },
  },

  hideWeatherLabel: true,
  showDistanceBeforeDuration: true,
  hideItinerarySettings: true,
  showTransitLegDistance: true,
  showDistanceInItinerarySummary: false,
  hideWalkOption: true,
  alwaysShowDistanceInKm: true,
  defaultSettings: {
    ...matkaConfig.defaultSettings,
    includeCarSuggestions: true,
    includeBikeSuggestions: false,
  },
  mainMenu: {
    showDisruptions: false,
    stopMonitor: {
      show: false,
    },
    showEmbeddedSearch: false,
  },
  showNearYouButtons: false,
  hideFavourites: true,
  hideStopRouteSearch: true,

  hideMapLayersByDefault: true,
  hideCarSuggestionDuration: true,

  hideWalkLegDurationSummary: true,
  emphasizeDistance: true,
  emphasizeOneWayJourney: true,

  terminalStopsMinZoom: 14,

  aboutThisService: {
    fi: [
      {
        header: 'Tietoja palvelusta',
        paragraphs: [
          'Tervetuloa Kelan reittioppaaseen! Palvelu perustuu Digitransit-palvelualustaan.',
        ],
        link: 'https://kela.fi',
      },
    ],

    sv: [
      {
        header: 'Om tjänsten',
        paragraphs: [
          'Den här tjänsten erbjuds av Fpa för reseplanering. Tjänsten baserar sig på Digitransit-plattformen.',
        ],
      },
    ],

    en: [
      {
        header: 'About this service',
        paragraphs: [
          'This service is provided by Kela for route planning. Service is built on Digitransit platform.',
        ],
      },
    ],
  },
});
