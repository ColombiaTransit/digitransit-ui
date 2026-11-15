// ColombiaTransit: journey planner for Colombia on https://colombiatransit.co
//
// Backends (all overridable with environment variables):
//   OTP       https://apiv2.colombiatransit.co/api/otp/   (ColombiaTransit/otp-docker)
//   Pelias    https://apiv2.colombiatransit.co/api/pelias/v1
//   map       https://tileserver.colombiatransit.co/styles/osm-bright/
//   stops     OTP vector tiles: .../api/otp/routers/default/vectorTiles/
//
// Merged on top of config.default.js (arrays replace, objects merge).

const CONFIG = 'colombiatransit';
const APP_TITLE = 'ColombiaTransit';
const APP_DESCRIPTION =
  'Planificador de viajes en transporte público para Colombia';
const YEAR = 1900 + new Date().getYear();

const API_URL = process.env.API_URL || 'https://apiv2.colombiatransit.co';
const OTP_URL = process.env.OTP_URL || `${API_URL}/api/otp/`;
const GEOCODING_BASE_URL =
  process.env.GEOCODING_BASE_URL || `${API_URL}/api/pelias/v1`;
const MAP_URL = process.env.MAP_URL || 'https://tileserver.colombiatransit.co';
const VECTOR_TILES = `${OTP_URL}routers/default/vectorTiles`;
const ROOTLINK = process.env.ROOTLINK || 'https://colombiatransit.co';

// Colombia (mainland, San Andrés and the Pacific islands)
const minLat = -4.2316872;
const maxLat = 16.0571269;
const minLon = -82.1243666;
const maxLon = -66.8511907;

const PRIMARY = '#dc0451';

export default {
  CONFIG,

  URL: {
    OTP: OTP_URL,
    MAP: {
      default: `${MAP_URL}/styles/osm-bright/`,
    },
    STOP_MAP: {
      default: `${VECTOR_TILES}/stops,stations/`,
    },
    // Used from stopsMinZoom on; OTP serves it from the same data.
    REALTIME_STOP_MAP: {
      default: `${VECTOR_TILES}/realtimeStops,stations/`,
    },
    // No bike sharing or park and ride yet: these layers are not served.
    RENTAL_STATION_MAP: { default: `${VECTOR_TILES}/rentalStations/` },
    REALTIME_RENTAL_STATION_MAP: {
      default: `${VECTOR_TILES}/realtimeRentalStations/`,
    },
    REALTIME_RENTAL_VEHICLE_MAP: {
      default: `${VECTOR_TILES}/realtimeRentalVehicles/`,
    },
    PARK_AND_RIDE_MAP: { default: `${VECTOR_TILES}/vehicleParking/` },
    PARK_AND_RIDE_GROUP_MAP: {
      default: `${VECTOR_TILES}/vehicleParkingGroups/`,
    },
    ROOTLINK,
    PELIAS: `${GEOCODING_BASE_URL}/search`,
    PELIAS_REVERSE_GEOCODER: `${GEOCODING_BASE_URL}/reverse`,
    PELIAS_PLACE: `${GEOCODING_BASE_URL}/place`,
  },

  // Our APIs need no Digitransit subscription key: send neither the
  // query parameter nor the header (the header would also need CORS).
  hasAPISubscriptionQueryParameter: false,
  hasAPISubscriptionHeader: false,

  title: APP_TITLE,
  meta: { description: APP_DESCRIPTION },
  socialMedia: {
    title: APP_TITLE,
    description: APP_DESCRIPTION,
  },

  appBarLink: { name: 'ColombiaTransit', href: ROOTLINK },
  textLogo: false,
  logo: 'colombiatransit/logo.png',
  favicon: './app/assets/images/colombiatransit/colombiatransit-favicon.png',

  colors: {
    primary: PRIMARY,
    bus: '#007ac9',
  },
  useExtendedRouteTypes: true,

  availableLanguages: ['es', 'en'],
  defaultLanguage: 'es',
  timeZone: 'America/Bogota',

  feedIds: [
    'bogota',
    'cali',
    'chia',
    'ibague',
    'medellin',
    'monserrate',
    'monteria',
    'pasto',
    'pereira',
    'popayan',
    'santa_marta',
    'sincelejo',
    'valledupar',
  ],

  transportModes: {
    bus: { availableForSelection: true, defaultValue: true },
    tram: { availableForSelection: true, defaultValue: true },
    subway: { availableForSelection: true, defaultValue: true },
    funicular: { availableForSelection: true, defaultValue: true },
    rail: { availableForSelection: false, defaultValue: false },
    ferry: { availableForSelection: false, defaultValue: false },
    airplane: { availableForSelection: false, defaultValue: false },
    citybike: { availableForSelection: false, defaultValue: false },
    scooter: { availableForSelection: false, defaultValue: false },
    taxi: { availableForSelection: false, defaultValue: false },
  },

  searchParams: {
    'boundary.rect.min_lat': minLat,
    'boundary.rect.max_lat': maxLat,
    'boundary.rect.min_lon': minLon,
    'boundary.rect.max_lon': maxLon,
  },

  areaPolygon: [
    [minLon, minLat],
    [minLon, maxLat],
    [maxLon, maxLat],
    [maxLon, minLat],
  ],

  // Origin when the user's location is outside the area.
  defaultEndpoint: {
    address: 'Plaza de Bolívar, Bogotá',
    lat: 4.598056,
    lon: -74.075833,
  },

  map: {
    // tileserver-gl raster tiles: 256 px, @2x on retina screens
    useRetinaTiles: true,
    tileSize: 256,
    zoomOffset: 0,
    minZoom: 5,
    maxZoom: 19,
    attribution:
      '<a tabIndex="-1" href="http://osm.org/copyright" target="_blank">© OpenStreetMap</a>',
    areaBounds: {
      corner1: [maxLat, maxLon], // north east
      corner2: [minLat, minLon], // south west
    },
  },

  stopCard: {
    header: {
      showDescription: true,
      showStopCode: true,
      showDistance: true,
    },
  },

  menu: {
    copyright: { label: `© ColombiaTransit ${YEAR}` },
    content: [
      {
        name: 'about-this-service',
        route: '/about-this-service',
      },
    ],
  },

  aboutThisService: {
    es: [
      {
        header: 'Acerca de este servicio',
        paragraphs: [
          'ColombiaTransit es un planificador de viajes en transporte público para ciudades de Colombia. El servicio se basa en la plataforma Digitransit y en OpenTripPlanner, con datos GTFS de los sistemas de transporte y mapas de © colaboradores de OpenStreetMap.',
        ],
      },
    ],
    en: [
      {
        header: 'About this service',
        paragraphs: [
          'ColombiaTransit is a public transport journey planner for cities in Colombia. It is built on the Digitransit platform and OpenTripPlanner, with GTFS data of the transit systems and maps by © OpenStreetMap contributors.',
        ],
      },
    ],
  },

  showWeatherInformation: false,
  includeCarSuggestions: false,
  includeParkAndRideSuggestions: false,
  showBikeAndParkItineraries: false,
  parkAndRide: { showParkAndRide: false },
  vehicles: false,
  messageBarAlerts: false,

  hostnames: ['https://colombiatransit.co', 'https://www.colombiatransit.co'],
};
