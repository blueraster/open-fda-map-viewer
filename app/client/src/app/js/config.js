// Snoqualmie Gourmet Ice Cream
export const config = {
  app: {
    rootClassName: 'root',
    dojoTheme: 'claro',
    requests: {
      ofdaRecalls: (recallTerm, limit, skip) => `http://api.fda.gov/food/enforcement.json?limit=${limit}&skip=${skip}&search=reason_for_recall:${recallTerm}`,
      ofdaTimeseries: (recallTerm) => `https://api.fda.gov/food/enforcement.json?&count=report_date&search=reason_for_recall:${recallTerm}`

    }
  },
  map: {
    id: 'map',
    options: {
      basemap: 'dark-gray',
      zoom: 5,
      // minZoom: 3,
      center: [-100, 34.5]
    },
    foods: {
      individual: {
        iceCream: 'Ice Cream',
        wheat: 'Wheat',
        peanuts: 'Peanuts',
        salads: 'Salads'
      },
      nested: {
        bacteria: [
          'Chloramphenicol',
          'Salmonella',
          'Listeria'
        ]
      }
    },
    controls: {
      ids: {
        home: 'home-button',
        locate: 'locate-button',
        search: 'search'
      }
    },
    requests: {
      geoData: () => 'http://localhost:3000/getGeoData',
    }
  }
}
export const app = config.app
export const map = config.map
