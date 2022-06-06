/* eslint-disable prefer-template */
import configMerger from '../util/configMerger';
import { BIKEAVL_BIKES } from '../util/citybikes';

const CONFIG = 'kuopio';
const APP_TITLE = 'Reittiopas Kuopio';
const APP_DESCRIPTION = 'Reittiopas Kuopio';

const walttiConfig = require('./config.waltti').default;

export default configMerger(walttiConfig, {
  CONFIG,

  appBarLink: { name: 'Kuopio', href: 'https://vilkku.kuopio.fi/' },

  colors: {
    primary: '#0ab1c8',
    iconColors: {
      'mode-bus': '#724f9f',
    },
  },

  socialMedia: {
    title: APP_TITLE,
    description: APP_DESCRIPTION,
  },

  title: APP_TITLE,

  favicon: './app/configurations/images/kuopio/favicon.png',

  // Navbar logo
  logo: 'kuopio/logo.png',
  secondaryLogo: 'kuopio/secondary-logo.png',

  feedIds: ['Kuopio'],

  showTicketInformation: true,

  useTicketIcons: true,

  ticketInformation: {
    primaryAgencyName: 'Kuopion seudun joukkoliikenne',
  },

  ticketLink: 'https://vilkku.kuopio.fi/lipputyypit-hinnat/lippujen-hinnat',

  // mapping fareId from OTP fare identifiers to human readable form
  fareMapping: function mapFareId(fareId) {
    return fareId && fareId.substring
      ? fareId.substring(fareId.indexOf(':') + 1)
      : '';
  },
  showTicketPrice: true,
  searchParams: {
    'boundary.rect.min_lat': 62.454915,
    'boundary.rect.max_lat': 63.469325,
    'boundary.rect.min_lon': 26.163918,
    'boundary.rect.max_lon': 29.013261,
  },

  areaPolygon: [
    [26.163918, 62.454915],
    [26.163918, 63.469325],
    [29.013261, 63.469325],
    [29.013261, 62.454915],
  ],

  defaultEndpoint: {
    address: 'Kuopion tori',
    lat: 62.892511,
    lon: 27.678136,
  },

  vehicles: true,
  showVehiclesOnStopPage: true,
  showVehiclesOnSummaryPage: true,

  cityBike: {
    networks: {
      vilkku: {
        enabled: true,
        season: {
          // 26.4. - 31.10.
          start: new Date(new Date().getFullYear(), 3, 26),
          end: new Date(new Date().getFullYear(), 10, 1),
        },
        capacity: BIKEAVL_BIKES,
        icon: 'citybike',
        name: {
          fi: 'Vilkku',
          sv: 'Vilkku',
          en: 'Vilkku',
        },
        type: 'citybike',
        url: {
          fi: 'https://kaupunkipyorat.kuopio.fi/',
          sv: 'https://kaupunkipyorat.kuopio.fi/?lang=2',
          en: 'https://kaupunkipyorat.kuopio.fi/?lang=2',
        },
      },
    },
  },

  transportModes: {
    citybike: {
      availableForSelection: true,
    },
  },

  menu: {
    copyright: { label: `© Kuopio ${walttiConfig.YEAR}` },
    content: [
      {
        name: 'menu-feedback',
        href: {
          fi: 'https://palaute.kuopio.fi/fi#!/palautelomake/27050/27054',
          sv: 'https://palaute.kuopio.fi/fi#!/palautelomake/27050/27054',
          en: 'https://palaute.kuopio.fi/en#!/palautelomake/27050/27054',
        },
      },
      {
        name: 'about-this-service',
        route: '/tietoja-palvelusta',
      },
      {
        name: 'accessibility-statement',
        href: {
          fi: 'https://www.digitransit.fi/accessibility',
          sv: 'https://www.digitransit.fi/accessibility',
          en: 'https://www.digitransit.fi/en/accessibility',
        },
      },
    ],
  },

  aboutThisService: {
    fi: [
      {
        header: 'Tietoja palvelusta',
        paragraphs: [
          'Tämän palvelun tarjoaa Kuopion seudun joukkoliikenne reittisuunnittelua varten Kuopion ja Siilinjärven alueella. Palvelu kattaa joukkoliikenteen, kävelyn, pyöräilyn ja yksityisautoilun rajatuilta osin. Palvelu perustuu Digitransit-palvelualustaan.',
        ],
      },
      {
        header: 'Tietolähteet',
        paragraphs: [
          'Kartat, tiedot kaduista, rakennuksista, pysäkkien sijainnista ynnä muusta tarjoaa © OpenStreetMap contributors. Osoitetiedot tuodaan Digi- ja väestötietoviraston rakennustietorekisteristä. Joukkoliikenteen reitit ja aikataulut perustuvat Kuopion tuottamaan GTFS-aineistoon.',
        ],
      },
    ],

    sv: [
      {
        header: 'Om tjänsten',
        paragraphs: [
          'Den här tjänsten erbjuds av Kuopion seudun joukkoliikenne för reseplanering inom Kuopio och Siilinjärvi region. Reseplaneraren täcker med vissa begränsningar kollektivtrafik, promenad, cykling samt privatbilism. Tjänsten baserar sig på Digitransit-plattformen.',
        ],
      },
      {
        header: 'Datakällor',
        paragraphs: [
          'Kartor, gator, byggnader, hållplatser och dylik information erbjuds av © OpenStreetMap contributors. Addressinformation hämtas från BRC:s byggnadsinformationsregister. Kollektivtrafikens rutter och tidtabeller är baserad på GTFS data från Kuopio.',
        ],
      },
    ],

    en: [
      {
        header: 'About this service',
        paragraphs: [
          'This service is provided by Kuopion seudun joukkoliikenne for route planning in Kuopio and Siilinjärvi region. The service covers public transport, walking, cycling, and some private car use. Service is built on Digitransit platform.',
        ],
      },
      {
        header: 'Data sources',
        paragraphs: [
          'Maps, streets, buildings, stop locations etc. are provided by © OpenStreetMap contributors. Address data is retrieved from the Building and Dwelling Register of the Finnish Population Register Center. Public transport routes and timetables are based on GTFS data produced by Kuopio.',
        ],
      },
    ],
  },
  geoJson: {
    layers: [
      {
        name: {
          fi: 'Vyöhykkeet',
          sv: 'Zoner',
          en: 'Zones',
        },
        url: '/assets/geojson/kuopio_zone_lines_20210222.geojson',
      },
    ],
  },
  zoneIdMapping: {
    1: 'A',
    2: 'B',
    3: 'C',
    4: 'D',
    5: 'E',
    6: 'F',
  },
  zones: {
    stops: true,
    itinerary: true,
  },
});
