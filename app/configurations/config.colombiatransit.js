/* eslint-disable */
import configMerger from '../util/configMerger';

const CONFIG = 'colombiatransit';
const APP_TITLE = 'ColombiaTransit';
const APP_DESCRIPTION = 'Colombiatransit';

const walttiConfig = require('./config.waltti').default;

const API_URL = process.env.API_URL || 'https://apiv2.colombiatransit.co';
const OTP_URL = process.env.OTP_URL || `${API_URL}/api/otp/v2/`;
const MAP_URL = process.env.MAP_URL || 'https://tileserver.colombiatransit.co';
const GEOCODING_BASE_URL = process.env.GEOCODING_BASE_URL || `${API_URL}/api/pelias/v1`;
const POI_MAP_PREFIX = `${OTP_URL}routers/default/vectorTiles`;

const rootLink = process.env.ROOTLINK || 'https://colombiatransit.co';

const minLat = -4.2316872;
const maxLat = 16.0571269;
const minLon = -82.1243666;
const maxLon = -66.8511907;

export default configMerger(walttiConfig, {
  CONFIG,
  OTPTimeout: process.env.OTP_TIMEOUT || 30000,
  URL: {
    OTP: OTP_URL,
    MAP: {
      default: `${MAP_URL}/styles/osm-bright/`,     
      es: `${MAP_URL}/styles/osm-bright/`,
      en: `${MAP_URL}/styles/osm-bright/`,
    },
    STOP_MAP: {
      default: `${POI_MAP_PREFIX}/stops/`,      
    },
    RENTAL_STATION_MAP: {
      default: `${POI_MAP_PREFIX}/rentalStations/`,
    },
    REALTIME_RENTAL_STATION_MAP: {
      default: `${POI_MAP_PREFIX}/realtimeRentalStations/`,
    },
    PARK_AND_RIDE_MAP: {
      default: `${POI_MAP_PREFIX}/vehicleParking/`,      
    },
    PARK_AND_RIDE_GROUP_MAP: {
      default: `${POI_MAP_PREFIX}/vehicleParkingGroups/`,
    },    
    ROOTLINK: rootLink,
    PELIAS: `${process.env.GEOCODING_BASE_URL || GEOCODING_BASE_URL}/search`,
    PELIAS_REVERSE_GEOCODER: `${
      process.env.GEOCODING_BASE_URL || GEOCODING_BASE_URL
    }/reverse`,
    PELIAS_PLACE: `${
      process.env.GEOCODING_BASE_URL || GEOCODING_BASE_URL
    }/place`
  },

  appBarLink: { name: 'Colombiatransit', href: 'https://colombiatransit.co/' },
  useExtendedRouteTypes: true,
  colors: {
    primary: '#007ac9',
    accessiblePrimary: '#0074be',
    hover: '#0062a1',
    iconColors: {
      'mode-bus': '#007ac9',
      'mode-bus-express': '#CA4000',
      'mode-bus-local': '#007ac9',
      'mode-rail': '#8c4799',
      'mode-tram': '#008151',
      'mode-ferry': '#007A97',
      'mode-ferry-pier': '#666666',
      'mode-metro': '#CA4000',
      'mode-citybike': '#f2b62d',
      'mode-citybike-secondary': '#333333',
      'mode-speedtram': '#007E79',
    },
  },

  availableLanguages: ['en', 'es'],
  defaultLanguage: 'en',

  transportModes: {
    bus: {
      availableForSelection: true,
      defaultValue: true,
      nearYouLabel: {
        en: 'Buses and nearby stops on map',
      },
    },
    rail: {
      availableForSelection: true,
      defaultValue: true,
      nearYouLabel: {
        en: 'Trains and nearby stations on map',
      },
    },
    tram: {
      availableForSelection: true,
      defaultValue: true,
      nearYouLabel: {
        en: 'Trams and nearby stops on map',
      },
    },
    subway: {
      availableForSelection: true,
      defaultValue: true,
      nearYouLabel: {        
        en: 'Metro and nearby stations on map',
      },
    },
    ferry: {
      availableForSelection: true,
      defaultValue: true,
      nearYouLabel: {       
        en: 'The closest ferry piers',
      },
    }
  },
  socialMedia: {
    title: APP_TITLE,
    description: APP_DESCRIPTION,
  },

  title: APP_TITLE,

  textLogo: false,
  logo: 'colombiatransit/logo2.png',
  favicon: './app/configurations/images/colombiatransit/LogoCT.png',
  useCookiesPrompt: true,

  feedIds: [],

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

  defaultEndpoint: {
    address: 'Bogotá Eldorado Airport',
    lat: 4.701944,
    lon: -74.147222,
  },
  nearbyRoutes: {
    radius: 10000,
    bucketSize: 1000,
  },

  omitNonPickups: true,
  maxNearbyStopAmount: 5,
  maxNearbyStopRefetches: 5,
  maxNearbyStopDistance: {
    favorite: 100000,
    bus: 100000,
    tram: 100000,
    subway: 100000,
    rail: 100000,
    ferry: 100000,
    citybike: 100000,
    airplane: 200000,
  },
  
  walkBoardCostHigh: 1600,
  showWeatherInformation: false,
  suggestWalkMaxDistance: 10000,
  suggestBikeMaxDistance: 30000,
  // if you enable car suggestions but the linear distance between all points is less than this, then a car route will
  // not be computed
  suggestCarMinDistance: 2000,
  minTransferTime: 90,
  optimize: 'SAFE',
  transferPenalty: 0,  
  // This timezone data will expire in 2037
  timezoneData:'America/Bogota|LMT BMT -05 -04|4U.g 4U.g 50 40|01232|-3sTv3.I 1eIo0 38yo3.I 1PX0|90e5',

  menu: {
    copyright: { label: `© Colombiatransit ${walttiConfig.YEAR}` },
    content: [
      {
        name: 'about-this-service',
        route: '/about-this-service',
      },
      {
        name: 'accessibility-statement',
        href:
          'https://kauppa.waltti.fi/media/authority/154/files/Saavutettavuusseloste_Waltti-reittiopas_JyQfJhC.htm',
      },
    ],
  },  

  map: {
    useRetinaTiles: false,
    tileSize: 256,
    zoomOffset: 0,
    minZoom: 1,
    maxZoom: 20,
    controls: {
      zoom: {
        // available controls positions: 'topleft', 'topright', 'bottomleft, 'bottomright'
        position: 'bottomright',
      },
      scale: {
        position: 'bottomright',
      },
    },
    genericMarker: {
      // Do not render name markers at zoom levels below this value
      nameMarkerMinZoom: 18,

      popup: {
        offset: [106, 16],
        maxWidth: 250,
        minWidth: 250,
      },
    },

    line: {
      halo: {
        weight: 7,
        thinWeight: 2,
      },

      leg: {
        weight: 6,
        thinWeight: 2,
      },

      passiveColor: '#758993',
    },

    showZoomControl: true, // DT-3470
    showWeatherInformation: false,
    showLayerSelector: true, // DT-3470
    showStopMarkerPopupOnMobile: true, // DT-3470
    showScaleBar: true, // DT-3470
    attribution:
      '<a tabIndex="-1" href="http://osm.org/copyright">© OpenStreetMap</a>', // DT-3470, DT-3397

    useModeIconsInNonTileLayer: false,
    // areBounds is for keeping map and user inside given area
    // Colombia
    areaBounds: {
      corner1: [16.0571269, -66.8511907], //north east
      corner2: [-4.2316872, -82.1243666], //south west
    },
  },

  stopCard: {
    header: {
      showDescription: true,
      showStopCode: true,
      showDistance: true,
    },
  },

  aboutThisService: {
    
    en: [
      {
        header: 'About this service',
        paragraphs: [
          'This service is provided by Colombiatransit for route planning in Colombia region. The service covers public transport, walking, cycling, and some private car use. Service is built on Digitransit platform.',
        ],
      },
    ],
  },
  
  includeCarSuggestions: false,
  includeParkAndRideSuggestions: false,
  // Include both bike and park and bike and public
  includePublicWithBikePlan: false,
  // Park and ride and car suggestions separated into two switches
  separatedParkAndRideSwitch: true,
  showBikeAndParkItineraries: false,
  showNearYouButtons: true,
  nearYouModes: [
    'favorite',
    'bus',
    'tram',
    'subway',
    'rail',
    'ferry',
    'citybike',
  ],
  narrowNearYouButtons: true,
  
  parkAndRide: {
    showParkAndRide: false,
    parkAndRideMinZoom: 13,   
  },
  
  hostnames: [
    // DEV hostnames    
    'https://digitransit.colombiatransit.co',    
    // PROD hostnames
    'https://colombiatransit.co',
    'https://www.colombiatransit.co',
  ],
},
);
