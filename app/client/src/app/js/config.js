export const config = {
  app: {
    rootClassName: 'root',
    dojoTheme: 'claro'
  },
  map: {
    id: 'map',
    options: {
      basemap: 'dark-gray',
      zoom: 5,
      minZoom: 3,
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
    eventsByFood: {

    },
    requests: {
      // openFdaEvent: () => 'https://api.fda.gov/food/enforcement.json?search=event_id:62644',
      // openFda: (recallReason) => `http://api.fda.gov/food/enforcement.json?limit=100&skip=100&search=reason_for_recall:${recallReason}`,
      ofdaRecalls: (recallTerm, limit, skip) => `http://api.fda.gov/food/enforcement.json?limit=${limit}&skip=${skip}&search=reason_for_recall:${recallTerm}`,
      geoData: (food) => `http://localhost:3000/getGeoData?food=${food}`
    }
  }
}
export const app = config.app
export const map = config.map
