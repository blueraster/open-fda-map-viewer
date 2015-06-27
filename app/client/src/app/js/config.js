// Snoqualmie Gourmet Ice Cream
export const config = {
  app: {
    rootClassName: 'root',
    dojoTheme: 'claro',
    requests: {
      ofdaRecalls: (recallTerm, limit, skip) => `http://api.fda.gov/food/enforcement.json?limit=${limit}&skip=${skip}&search=reason_for_recall:${recallTerm}`,
      ofdaTimeseries: (recallTerm) => `https://api.fda.gov/food/enforcement.json?&count=report_date&search=reason_for_recall:${recallTerm}`

    },
    detailLabels: [
      {key: 'report_date', text: 'Report Date'},
      {key: 'recalling_firm', text: 'Recalling Firm'},
      {key: 'recall_number', text: 'Recall Number'},
      {key: 'city', text: 'City'},
      {key: 'state', text: 'State'},
      {key: 'status', text: 'Status'},
      {key: 'distribution_pattern', text: 'Distribution Pattern'},
      {key: 'product_description', text: 'Product Description'}
    ]
  },
  panel: {
    foods: {
      individual: {
        iceCream: 'Ice Cream',
        wheat: 'Wheat',
        salads: 'Salads',
        peanuts: 'Peanuts'
      },
      nested: {
        bacteria: [
          'Chloramphenicol',
          'Salmonella',
          'Listeria'
        ]
      }
    },
    ids: {
      firmSelect: 'firm',
      eventSelect: 'event',
      recallSelect: 'recall'
    }
  },
  map: {
    id: 'map',
    options: {
      basemap: 'dark-gray',
      zoom: 5,
      minZoom: 3,
      maxZoom: 8,
      center: [-100, 34.5]
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
export const panel = config.panel
